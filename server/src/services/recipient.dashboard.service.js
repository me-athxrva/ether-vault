const mongoose = require("mongoose");
const Document = require("../models/document.model");
const ActivityLog = require("../models/activity.model");

async function getRecipientDashboardData(userId) {
  const uid = new mongoose.Types.ObjectId(userId);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [stats, recentDocuments, recentActivity, receivedChart] =
    await Promise.all([

      Document.aggregate([
        { $match: { receiverId: uid } },
        {
          $group: {
            _id: null,
            totalReceivedDocuments: { $sum: 1 },
            activeDocuments: {
              $sum: { $cond: ["$isRevoked", 0, 1] },
            },
            revokedDocuments: {
              $sum: { $cond: ["$isRevoked", 1, 0] },
            },
          },
        },
      ]),

      Document.find({ receiverId: uid })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("issuerId", "name email")
        .populate("organisationId", "name")
        .lean(),

      ActivityLog.find({ userId: uid })
        .sort({ createdAt: -1 })
        .limit(15)
        .lean(),

      Document.aggregate([
        {
          $match: {
            receiverId: uid,
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
    ]);

  const rawStats = stats[0] || {};

  return {
    stats: {
      totalReceivedDocuments: rawStats.totalReceivedDocuments || 0,
      activeDocuments: rawStats.activeDocuments || 0,
      revokedDocuments: rawStats.revokedDocuments || 0,
    },
    recentDocuments: recentDocuments.map(formatRecipientDocument),
    recentActivity: recentActivity.map(formatActivity),
    chartData: {
      receivedPerDay: receivedChart,
    },
  };
}

async function getRecipientDocuments(userId, query = {}) {
  const {
    page = 1,
    limit = 15,
    sort = "latest",
    status,
    search,
    startDate,
    endDate,
  } = query;

  const filter = { receiverId: new mongoose.Types.ObjectId(userId) };

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

  if (search) {
    const regex = new RegExp(search, "i");
    filter.$or = [{ title: regex }, { verifyId: regex }];
  }

  const sortMap = {
    latest: { createdAt: -1 },
    oldest: { createdAt: 1 },
  };
  const sortOption = sortMap[sort] || sortMap.latest;

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const parsedLimit = parseInt(limit, 10);

  const [documents, totalCount] = await Promise.all([
    Document.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(parsedLimit)
      .populate("issuerId", "name email")
      .populate("organisationId", "name")
      .lean(),
    Document.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalCount / parsedLimit);

  return {
    documents: documents.map(formatRecipientDocument),
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

async function getRecipientDocumentById(documentId, userId) {
  const doc = await Document.findOne({
    _id: documentId,
    receiverId: userId,
  })
    .populate("issuerId", "name email organisationName")
    .populate("organisationId", "name")
    .lean();

  if (!doc) return null;

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
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    },
  };
}

async function getRecipientActivity(userId, query = {}) {
  const { page = 1, limit = 20, type } = query;

  const filter = { userId: new mongoose.Types.ObjectId(userId) };
  if (type) filter.type = type;

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const parsedLimit = parseInt(limit, 10);

  const [activities, totalCount] = await Promise.all([
    ActivityLog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit)
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

function formatRecipientDocument(doc) {
  return {
    id: doc._id,
    title: doc.title,
    verifyId: doc.verifyId,
    hash: doc.hash,
    cid: doc.cid,
    txHash: doc.txHash,
    isRevoked: doc.isRevoked,
    organisationName:
      doc.organisationId?.name || doc.organisationName || null,
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
    createdAt: activity.createdAt,
  };
}

module.exports = {
  getRecipientDashboardData,
  getRecipientDocuments,
  getRecipientDocumentById,
  getRecipientActivity,
};
