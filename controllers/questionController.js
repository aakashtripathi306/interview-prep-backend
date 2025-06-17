import question from "../models/Question.js";
import Question from "../models/Question.js";
import Session from "../models/Session.js";

export const addQuestionsToSession=async(req,res)=>{
try{
const {sessionId,questions}=req.body;

if(!sessionId || !questions ||!Array.isArray(questions) ){
    return res.status(400).json({message:"Invalid request"});
}
const session =await Session.findById(sessionId);

if(!session){
    return res.status(404).json({message:"Session not found"});
}

const createQuestions=await Question.insertMany(
    questions.map((q)=>({
session:sessionId,
question : q.question,
answer : q.answer,

    }))
)
session.questions.push(...createQuestions.map((q)=>q._id));

await session.save();
res.status(201).json(createQuestions);
}catch(error){
    res.status(500).json({message:"Server error",error:error.message});
}
}

export const togglePinQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Toggle
    question.isPinned = !question.isPinned;
    await question.save();

    const message = question.isPinned
      ? "Question pinned successfully"
      : "Question unpinned successfully";

    res.status(200).json({ message, question });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const updateQuestionNote=async(req,res)=>{
    try{
        const{note}=req.body;
        const question=await Question.findById(req.params.id);
        if(!question){
            return res.status(404).json({message:"Question not found"});
        }
        question.note=note || "";
        await question.save();
        res.status(200).json({message:"Question note updated successfully"});
    }catch(error){
        res.status(500).json({message:"Server error",error:error.message});
    }
}