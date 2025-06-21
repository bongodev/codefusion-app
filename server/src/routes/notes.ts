import { Request, Response, Router } from "express";
import { CreateNoteRequest } from "../types";
import { NoteModel } from "../models/note";
import mongoose, { MongooseError } from "mongoose";

const route = Router();

route.post("/", async (req: Request, res: Response) => {
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

export default route;
