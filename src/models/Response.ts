import { Schema, model } from "mongoose";

const responseSchema = new Schema({
  taskId: { type: Schema.Types.ObjectId, ref: "Task", required: true },
  questionId: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  questionTitle: { type: String, required: true },
  questionType: { type: String, required: true },  // new field to handle type
  description: { type: String, required: true },
  answerType: { type: String, required: true },
  userId: { type: String, },

  required: { type: Boolean, },
  timeLimit: { type: Number },
  Answer: {
    form: [
      {
        id: { type: Schema.Types.ObjectId, required: true },
        title: { type: String, required: true },
        input: { type: String, required: true },
      },
    ],
    choices: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        questionId: { type: String, required: true },
        selected: { type: Boolean, required: true },
      },
    ],
    files: [
      {
        id: { type: String, required: true },
        url: { type: String, required: false } , 
        type: { type: String, required: false } ,
        source: { type: String, required: false } ,
        name: { type: String, required: false } ,
        size: { type: String, required: false } ,


      },
    ],
    textInput: { type: String },

    rating: { 
      value: { type: Number }, 
      max: { type: Number },   
    },
 
  },

  timeOnScreen: { type: Number },
  hasRule: { type: Boolean },
  responded: { type: Boolean },
});

export const Response = model("Response", responseSchema);
