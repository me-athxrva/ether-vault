const mongoose = require("mongoose");
const Document = require("../models/document.model");
const ActivityLog = require("../models/activity.model");

async function getIssuerDashboardData(userId, organisationId) {
  const orgId = new mongoose.Types.ObjectId(organisationId);
  const now = new Date();

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
  startOfWeek.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);

  const [
    stats,
    recentDocuments,
    recentActivity,
    uploadsChart,
    statusDistribution,
    quickMetrics,
  ] = await Promise.all([

    Document.aggregate([
      { $match: { organisationId: orgId } },
      {
        $facet: {
          totals: [
            {
              $group: {
                _id: null,
                totalDocuments: { $sum: 1 },
                revokedDocuments: {
                  $sum: { $cond: ["$isRevoked", 1, 0] },
                },
                activeDocuments: {
                  $sum: { $cond: ["$isRevoked", 0, 1] },
                },
              },
            },
          ],
          thisWeek: [
            { $match: { createdAt: { $gte: startOfWeek } } },
            { $count: "count" },
          ],
          thisMonth: [
            { $match: { createdAt: { $gte: startOfMonth } } },
            { $count: "count" },
          ],
        },
      },
    ]),

    Document.find({ organisationId: orgId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("receiverId", "name email")
      .populate("issuerId", "name email")
      .lean(),

    ActivityLog.find({ organisationId: orgId })
      .sort({ createdAt: -1 })
      .limit(15)
      .populate("userId", "name email")
      .lean(),

    Document.aggregate([
      {
        $match: {
          organisationId: orgId,
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: "$_id", count: 1 } },
    ]),

    Document.aggregate([
      { $match: { organisationId: orgId } },
      {
        $group: {
          _id: { $cond: ["$isRevoked", "revoked", "active"] },
          count: { $sum: 1 },
        },
      },
      { $project: { _id: 0, status: "$_id", count: 1 } },
    ]),

    Promise.all([
      Document.findOne({ organisationId: orgId })
        .sort({ createdAt: -1 })
        .select("title txHash cid createdAt")
        .lean(),
      ActivityLog.findOne({
        organisationId: orgId,
        type: "verification_success",
      })
        .sort({ createdAt: -1 })
        .lean(),
    ]),
  ]);

  const rawTotals = stats[0]?.totals?.[0] || {};
  const totalVerifications = await ActivityLog.countDocuments({
    organisationId: orgId,
    type: { $in: ["verification_success", "verification_failed"] },
  });

  return {
    stats: {
      totalDocuments: rawTotals.totalDocuments || 0,
      activeDocuments: rawTotals.activeDocuments || 0,
      revokedDocuments: rawTotals.revokedDocuments || 0,
      totalVerifications,
      documentsUploadedThisWeek: stats[0]?.thisWeek?.[0]?.count || 0,
      documentsUploadedThisMonth: stats[0]?.thisMonth?.[0]?.count || 0,
    },
    recentDocuments: recentDocuments.map(formatDocument),
    recentActivity: recentActivity.map(formatActivity),
    chartData: {
      uploadsPerDay: uploadsChart,
      statusDistribution,
    },
    quickMetrics: {
      latestUpload: quickMetrics[0]
        ? {
            title: quickMetrics[0].title,
            txHash: quickMetrics[0].txHash,
            cid: quickMetrics[0].cid,
            uploadedAt: quickMetrics[0].createdAt,
          }
        : null,
      latestVerification: quickMetrics[1]
        ? {
            message: quickMetrics[1].message,
            at: quickMetrics[1].createdAt,
          }
        : null,
    },
  };
}

async function getIssuerDocuments(organisationId, query = {}) {
  const {
    page = 1,
    limit = 15,
    sort = "latest",
    status,
    search,
    startDate,
    endDate,
  } = query;

  const orgId = new mongoose.Types.ObjectId(organisationId);
  const filter = { organisationId: orgId };

  if (status === "active") filter.isRevoked = false;
  if (status === "revoked") filter.isRevoked = true;

  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filter.createdAt.$lte = end;
    }
  }

  const sortMap = {
    latest: { createdAt: -1 },
    oldest: { createdAt: 1 },
  };
  const sortOption = sortMap[sort] || sortMap.latest;

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const parsedLimit = parseInt(limit, 10);

  let searchFilter = {};
  if (search) {
    const regex = new RegExp(search, "i");
    searchFilter = {
      $or: [{ title: regex }],
    };
  }

  const combinedFilter = { ...filter, ...searchFilter };

  if (search) {
    const regex = new RegExp(search, "i");
    const User = require("../models/user.model");
    const matchingUsers = await User.find({
      $or: [{ name: regex }, { email: regex }],
    }).select("_id");

    const userIds = matchingUsers.map((u) => u._id);
    if (userIds.length > 0) {
      combinedFilter.$or = [
        { title: new RegExp(search, "i") },
        { receiverId: { $in: userIds } },
      ];
    }
  }

  const [documents, totalCount] = await Promise.all([
    Document.find(combinedFilter)
      .sort(sortOption)
      .skip(skip)
      .limit(parsedLimit)
      .populate("receiverId", "name email")
      .populate("issuerId", "name email")
      .lean(),
    Document.countDocuments(combinedFilter),
  ]);

  const totalPages = Math.ceil(totalCount / parsedLimit);

  return {
    documents: documents.map(formatDocument),
    pagination: {
      total: totalCount,
      page: parseInt(page, 10),
      totalPages,
      limit: parsedLimit,
      hasNextPage: parseInt(page, 10) < totalPages,
      hasPrevPage: parseInt(page, 10) > 1,
    },
  };
}

async function getIssuerDocumentById(documentId, organisationId) {
  const doc = await Document.findOne({
    _id: documentId,
    organisationId,
  })
    .populate("receiverId", "name email")
    .populate("issuerId", "name email organisationName")
    .populate("organisationId", "name")
    .lean();

  if (!doc) return null;

  const activityLogs = await ActivityLog.find({
    "metadata.documentId": doc._id,
  })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate("userId", "name email")
    .lean();

  return {
    document: {
      id: doc._id,
      title: doc.title,
      verifyId: doc.verifyId,
      hash: doc.hash,
      cid: doc.cid,
      txHash: doc.txHash,
      isRevoked: doc.isRevoked,
      organisation: {
        id: doc.organisationId?._id || doc.organisationId,
        name: doc.organisationId?.name || doc.organisationName,
      },
      issuer: doc.issuerId
        ? {
            id: doc.issuerId._id,
            name: doc.issuerId.name,
            email: doc.issuerId.email,
          }
        : null,
      recipient: doc.receiverId
        ? {
            id: doc.receiverId._id,
            name: doc.receiverId.name,
            email: doc.receiverId.email,
          }
        : null,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    },
    activityLogs: activityLogs.map(formatActivity),
  };
}

async function getIssuerActivity(organisationId, query = {}) {
  const { page = 1, limit = 20, type } = query;

  const filter = {
    organisationId: new mongoose.Types.ObjectId(organisationId),
  };

  if (type) filter.type = type;

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const parsedLimit = parseInt(limit, 10);

  const [activities, totalCount] = await Promise.all([
    ActivityLog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit)
      .populate("userId", "name email")
      .lean(),
    ActivityLog.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalCount / parsedLimit);

  return {
    activities: activities.map(formatActivity),
    pagination: {
      total: totalCount,
      page: parseInt(page, 10),
      totalPages,
      limit: parsedLimit,
      hasNextPage: parseInt(page, 10) < totalPages,
      hasPrevPage: parseInt(page, 10) > 1,
    },
  };
}

async function getIssuerAnalytics(organisationId) {
  const orgId = new mongoose.Types.ObjectId(organisationId);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const [
    uploadsPerDay,
    uploadsPerWeek,
    uploadsPerMonth,
    verificationStats,
    topRecipients,
    recentTrend,
  ] = await Promise.all([

    Document.aggregate([
      {
        $match: {
          organisationId: orgId,
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: "$_id", count: 1 } },
    ]),

    Document.aggregate([
      {
        $match: {
          organisationId: orgId,
          createdAt: { $gte: ninetyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $isoWeekYear: "$createdAt" },
            week: { $isoWeek: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.week": 1 } },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          week: "$_id.week",
          count: 1,
        },
      },
    ]),

    Document.aggregate([
      { $match: { organisationId: orgId } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, month: "$_id", count: 1 } },
    ]),

    ActivityLog.aggregate([
      {
        $match: {
          organisationId: orgId,
          type: { $in: ["verification_success", "verification_failed"] },
        },
      },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
      { $project: { _id: 0, type: "$_id", count: 1 } },
    ]),

    Document.aggregate([
      { $match: { organisationId: orgId } },
      {
        $group: {
          _id: "$receiverId",
          documentCount: { $sum: 1 },
        },
      },
      { $sort: { documentCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          recipientId: "$_id",
          name: "$user.name",
          email: "$user.email",
          documentCount: 1,
        },
      },
    ]),

    (async () => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

      const [currentWeek, previousWeek] = await Promise.all([
        Document.countDocuments({
          organisationId: orgId,
          createdAt: { $gte: sevenDaysAgo },
        }),
        Document.countDocuments({
          organisationId: orgId,
          createdAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo },
        }),
      ]);

      const changePercent =
        previousWeek === 0
          ? currentWeek > 0
            ? 100
            : 0
          : Math.round(
              ((currentWeek - previousWeek) / previousWeek) * 100,
            );

      return {
        currentWeek,
        previousWeek,
        changePercent,
        trend: changePercent >= 0 ? "up" : "down",
      };
    })(),
  ]);

  const successCount =
    verificationStats.find((v) => v.type === "verification_success")?.count ||
    0;
  const failureCount =
    verificationStats.find((v) => v.type === "verification_failed")?.count ||
    0;
  const totalVerifications = successCount + failureCount;

  return {
    uploads: {
      perDay: uploadsPerDay,
      perWeek: uploadsPerWeek,
      perMonth: uploadsPerMonth,
    },
    verifications: {
      total: totalVerifications,
      successCount,
      failureCount,
      successRate:
        totalVerifications > 0
          ? Math.round((successCount / totalVerifications) * 100)
          : 0,
      failureRate:
        totalVerifications > 0
          ? Math.round((failureCount / totalVerifications) * 100)
          : 0,
    },
    topRecipients,
    recentTrend,
  };
}

function formatDocument(doc) {
  return {
    id: doc._id,
    title: doc.title,
    verifyId: doc.verifyId,
    hash: doc.hash,
    cid: doc.cid,
    txHash: doc.txHash,
    isRevoked: doc.isRevoked,
    organisationName: doc.organisationName,
    recipient: doc.receiverId
      ? {
          id: doc.receiverId._id || doc.receiverId,
          name: doc.receiverId.name || null,
          email: doc.receiverId.email || null,
        }
      : null,
    issuer: doc.issuerId
      ? {
          id: doc.issuerId._id || doc.issuerId,
          name: doc.issuerId.name || null,
          email: doc.issuerId.email || null,
        }
      : null,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

function formatActivity(activity) {
  return {
    id: activity._id,
    type: activity.type,
    message: activity.message,
    metadata: activity.metadata || {},
    user: activity.userId
      ? {
          id: activity.userId._id || activity.userId,
          name: activity.userId.name || null,
          email: activity.userId.email || null,
        }
      : null,
    createdAt: activity.createdAt,
  };
}

module.exports = {
  getIssuerDashboardData,
  getIssuerDocuments,
  getIssuerDocumentById,
  getIssuerActivity,
  getIssuerAnalytics,
};
