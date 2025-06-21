import { Request, Response, Router } from "express";
import { CreateNoteRequest, SearchRequest, SearchResponse } from "../types";
import { NoteModel } from "../models/note";
import mongoose, { MongooseError } from "mongoose";

const router = Router();

interface MongoQuery {
  // userId: mongoose.Types.ObjectId;
  $text?: { $search: string };
  tags?: { $in: string[] };
  "sentiment.label"?: string;
  createdAt?: {
    $gte?: Date;
    $lte?: Date;
  };
}

interface DateFilter {
  $gte?: Date;
  $lte?: Date;
}

router.post("/", async (req: Request, res: Response) => {
  try {
    const noteData: CreateNoteRequest = req.body;

    const note = new NoteModel({
      ...noteData,
      // change during authentication
      userId: new mongoose.Types.ObjectId(),
    });

    const savedNote = await note.save();

    res.status(201).json(savedNote.toJSON());
  } catch (error) {
    if (error instanceof MongooseError) {
      return res.status(400).json(error);
    }
    return res.status(500).json(error);
  }
});

router.post("/search", async (req: Request, res): Promise<void> => {
  try {
    const searchParams: SearchRequest = req.body;
    const page = Math.max(1, searchParams.page || 1);
    const limit = Math.min(50, Math.max(1, searchParams.limit || 20));
    const skip = (page - 1) * limit;

    // const userId = new mongoose.Types.ObjectId(req.user.userId);

    // Build search query with proper typing
    // const query: MongoQuery = { userId };
    const query: MongoQuery = {};

    // Text search
    if (searchParams.query) {
      query.$text = { $search: searchParams.query };
    }

    // Filter by tags
    if (searchParams.tags && searchParams.tags.length > 0) {
      query.tags = { $in: searchParams.tags };
    }

    // Filter by sentiment
    if (searchParams.sentiment) {
      query["sentiment.label"] = searchParams.sentiment;
    }

    // Date range filter
    if (searchParams.dateRange) {
      const dateFilter: DateFilter = {};
      if (searchParams.dateRange.from) {
        dateFilter.$gte = new Date(searchParams.dateRange.from);
      }
      if (searchParams.dateRange.to) {
        dateFilter.$lte = new Date(searchParams.dateRange.to);
      }
      if (Object.keys(dateFilter).length > 0) {
        query.createdAt = dateFilter;
      }
    }

    // Build sort criteria - using 'any' for MongoDB query compatibility
    let sortCriteria = {};
    switch (searchParams.sortBy) {
      case "relevance":
        if (searchParams.query) {
          sortCriteria = { score: { $meta: "textScore" } };
        } else {
          sortCriteria = { createdAt: -1 };
        }
        break;
      case "title":
        sortCriteria = { title: 1 };
        break;
      case "date":
      default:
        sortCriteria = { createdAt: -1 };
        break;
    }

    // Get total count
    const totalCount = await NoteModel.countDocuments(query);

    // Execute search
    const notesQuery = NoteModel.find(query);

    const notes = await notesQuery
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit)
      .lean();

    const totalPages = Math.ceil(totalCount / limit);

    const searchResponse: SearchResponse = {
      notes: notes.map((note) => ({
        ...note,
        _id: note._id.toString(),
        userId: note.userId.toString(),
      })),
      totalCount,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };

    res.json(searchResponse);
  } catch (error) {
    console.error("Search notes error:", error);
    const response = {
      success: false,
      error: "Search failed",
    };
    res.status(500).json(response);
  }
});

export default router;
