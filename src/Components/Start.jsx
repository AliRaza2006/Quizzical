import Select from 'react-select'
import {categories} from '../utils/option'

const difficultyType=["Easy","Medium","Hard"]
const question=[{name:"Multiple choice",value:"multiple"},{name:"True/False",value:"boolean"}]
export function Start({toggle,handleCategoryChange,handleDifficulty,handleQuestionType,handleNumberOfQuestions,questionType,difficulty,numQuestionRef})
{
    return(
        <div className="Starter">
            <h1>Quizzical</h1>
            <div style={{ width: "250px",marginBlock:"20px"}}>
            <Select options={categories} placeholder="Select category"  isClearable onChange={handleCategoryChange}/>
            </div>
            <div className='options'>
                <p>Difficulty: </p>
                {
                    difficultyType.map((type,index)=>(
                        <label key={index} className={`Difficulty ${difficulty===type.toLowerCase()?"StartInputColors":""}`}>
                            <span>{type}</span>
                            <input type='radio' value={type.toLowerCase()} name='difficulty' onChange={(e)=>handleDifficulty(e)}/>
                        </label>
                    ))
                }
            </div>
            <div className='options'>
                <p>Question Type: </p>
                {
                    question.map((type,index)=>(
                        <label key={index} className={`Difficulty ${questionType===type.value?"StartInputColors":""}`}>
                            <span>{type.name}</span>
                            <input type='radio' value={type.value} name='QuestionType' onChange={(e)=>handleQuestionType(e)}/>
                        </label>
                    ))
                }
            </div>
            <div className='options'>
                <p>Number of questions: </p>
                <input type='text' className='Difficulty numberOfQuestions' onChange={(e)=>handleNumberOfQuestions(e)}/>
            </div>
            <button onClick={toggle}>Start Quiz</button>
        </div>
    )
}