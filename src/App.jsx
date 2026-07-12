import { useEffect, useRef, useState } from 'react'
import { Start } from './Components/Start'
import { Question } from './Components/Question'
import he from "he"
import { nanoid } from 'nanoid'
export default function App() {
  const [gameState,setGameState]=useState("Home")
  const [Questions,setQuestions]=useState([])
  const [loading,setLoading]=useState(true)
  const [difficulty,setDifficulty]=useState("")
  const [questionType,setQuestionType]=useState("")
  const categoryRef=useRef(null)
  const numQuestionRef=useRef(null)
  let numberOfCorrectAnswers=0
  for(let i=0;i<Questions.length;i++)
  {
    if(Questions[i].selected===Questions[i].correct_answer)
    {
      numberOfCorrectAnswers++
    }
  }
  function handleCategoryChange(option) {
    categoryRef.current = option.value;
    console.log(categoryRef)
  }
  async function getQuestions()
  {
    setLoading(true)
    const start = Date.now();

    const params = new URLSearchParams();
    if(numQuestionRef.current>0)
    params.append("amount", numQuestionRef.current);
    else
    params.append("amount", 5);
    if (categoryRef.current)
        params.append("category", categoryRef.current);
    if (difficulty)
        params.append("difficulty", difficulty);
    if (questionType)
        params.append("type", questionType);
    const url = `https://opentdb.com/api.php?${params.toString()}`;

    try
    {
      const res = await fetch(url)
      const data = await res.json()
      const result=data.results.map((item)=>{
  
        const options=[...item.incorrect_answers,item.correct_answer]
        for(let i=0;i<options.length;i++)
        {
          options[i]=he.decode(options[i])
        }
        if(item.type==="multiple")
        {
          for (let i = options.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [options[i], options[j]] = [options[j], options[i]];
          }
        }
        else if(item.type!="multiple"&&options[0]==="False")
        {
          [options[0],options[1]]=[options[1],options[0]]
        }
        return({
          ...item,
          options,
          question:he.decode(item.question),
          correct_answer:he.decode(item.correct_answer),
          incorrect_answers:item.incorrect_answers.map((answer)=>(
            he.decode(answer)
          )),
          selected:"",
          id:nanoid(),
        })
      })
      setQuestions(result)
    }
    catch(err)
    {
      console.log(err)
    }
    finally
    {
      const elapsed = Date.now() - start;
      const minLoadingTime = 1800; // 1.8 second

      if (elapsed < minLoadingTime) {
          await new Promise(resolve =>
              setTimeout(resolve, minLoadingTime - elapsed)
          );
      }
      setLoading(false);
    }
  }
  async function StartGame()
  {
    setGameState("Playing")
    await getQuestions()
  }
  function handleSelect(id,option)
  {
    setQuestions((prevQuestions)=>(
      prevQuestions.map((question)=>(
        id===question.id?{...question,selected:option}:question
      ))
    ))
  }
  function checkAnswers()
  {
    setGameState("Checking")
  }
  function handleQuestionType(e)
  {
    setQuestionType(e.target.value)
    console.log(questionType)
  }
  function handleDifficulty(e)
  {
    setDifficulty(e.target.value)
    console.log(difficulty)
  }
  function handleNumberOfQuestions(e)
  {
    numQuestionRef.current=Number(e.target.value)
    console.log(numQuestionRef)
  }
  function handleNewGame()
  {
    setGameState("Home")
    setDifficulty("")
    setQuestionType("")
    categoryRef.current=null
    numQuestionRef.current=null
    setQuestions([])
  }
  console.log(gameState)
  return(
    <>
    {
      gameState==="Home"?
      
      <Start handleCategoryChange={handleCategoryChange}
      toggle={StartGame}
      handleDifficulty={handleDifficulty}
      handleQuestionType={handleQuestionType}
      difficulty={difficulty}
      questionType={questionType}
      handleNumberOfQuestions={handleNumberOfQuestions}/>:
      
      loading?
      <div className='loading'><div className="loader"></div></div>:
      <>
      <div className='questionsWrapper'>
      <form>
      {
        Questions.map((item,index)=>{
          return( 
            <Question
            options={item.options}
            question={item.question}
            key={index+1} name={"q"+index} 
            id={item.id}
            handleSelect={handleSelect}
            correct={item.correct_answer}
            selected={item.selected}
            gameState={gameState}/>
          )
        })
      }
      </form>
      {gameState!="Checking"?
      <button className='checkAnswer' onClick={checkAnswers}>Check answers</button>:
      
      <div className="NewGameWrapper">
        <p>You scored {numberOfCorrectAnswers}/{Questions.length} correct answers</p>
        <button onClick={handleNewGame}>New Game</button>    
      </div>
      }
      </div>
      </>
    }
    </>
  )
}