import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Progress } from 'reactstrap';
import { Icon } from 'evergreen-ui';
import _ from 'lodash';

import './App.scss'
import questions from './questions.json';

const App = () => {
  const que_count = questions.length;
  const [que_index, setQueIndex] = useState(0);
  const [answer, setAnswer] = useState({ text: '' });
  const [answers, setAnswers] = useState([]);
  const [correct_count, setCorrectCount] = useState(0);

  const isAnswered = answer.text !== '';
  const incorrect_count = que_index - !isAnswered - correct_count;

  useEffect(() => {
    onNextQuestion();
  }, []);

  const onNextQuestion = () => {
    if (que_index < que_count) {
      setQueIndex(que_index + 1)

      let ansArr = [];
      ansArr.push({
        text: questions[que_index].correct_answer,
        correct: true,
      });
      questions[que_index].incorrect_answers.map(ans => {
        ansArr.push({
          text: ans,
          correct: false,
        });
      })
      ansArr = _.shuffle(ansArr);

      setAnswers(ansArr);

      setAnswer({ text: '' });
    }
  }

  const onClickAnswer = ans => {
    setAnswer(ans);

    if (ans.correct) {
      setCorrectCount(correct_count + 1);
    }
  }

  const renderDifficulty = () => {
    const difficultyText = questions[que_index - 1].difficulty;
    let diffLevel = 0;
    if (difficultyText === 'easy') {
      diffLevel = 1;
    } else if (difficultyText === 'medium') {
      diffLevel = 2;
    } else if (difficultyText === 'hard') {
      diffLevel = 3;
    }
    return (
      <div className="diff-stars">
      { _.range(1, 4).map(level => {
        if (level <= diffLevel) {
          return <Icon key={level} icon="star" size={15} />
        } else {
          return <Icon key={level} icon="star-empty" size={15} />
        }
      }) }
      </div>
    )
  }

  const renderAnswers = () => {
    if (!isAnswered) {  // not answered
      return (
        <>
          { answers.map((ans, index) => 
            <Col key={index} md={6} className="text-center mb-5">
              <Button color="light"
                onClick={ () => onClickAnswer(ans) }
              >{ decodeURIComponent(ans.text) }</Button>
            </Col>
          ) }
        </>
      )
    } else if (answer.correct) {  // answered correct
      return (
        <>
          { answers.map((ans, index) => 
            <Col key={index} md={6} className="text-center mb-5">
              <Button color={ ans.text === answer.text ? 'dark' : 'light' } disabled={ ans.text !== answer.text }>{ decodeURIComponent(ans.text) }</Button>
            </Col>
          ) }
        </>
      )
    } else { // answered incorrect
      return (
        <>
          { answers.map((ans, index) => 
            <Col key={index} md={6} className="text-center mb-5">
              <Button color={ ans.text === answer.text ? 'dark' : (ans.correct ? 'white' : 'light') } disabled={ ans.text !== answer.text }>{ decodeURIComponent(ans.text) }</Button>
            </Col>
          ) }
        </>
      )
    }
  }

  return (
    <div className="App d-flex flex-column">
      <div className="status-bar bg-secondary mb-5" 
        style={{ width: `${ que_index / que_count * 100 }%` }}
      />

      { que_index > 0 &&
        <Container className="question-area d-flex flex-column">
          <div className="question-header mb-5">
            <h1 className="text-secondary">Question { que_index } of { que_count }</h1>
            <p className="text-muted m-0">{ decodeURIComponent(questions[que_index - 1].category) }</p>
            { renderDifficulty() }
          </div>

          <div className="question-body">
            <h3 className="mb-5">{ decodeURIComponent(questions[que_index - 1].question) }</h3>
            <Row className="answers-list mb-5">
              { renderAnswers() }
            </Row>
            { isAnswered && (
              <div className="text-center">
                { answer.correct ? (
                  <h1>Correct!</h1>
                ):(
                  <h1>Sorry!</h1>
                )}
                { que_index < que_count ? (
                  <Button color="light" className="mb-5"
                    onClick={ onNextQuestion }
                  >Next Question</Button>
                ):(
                  <h1>Score: { parseInt(correct_count / que_count * 100) }%</h1>
                ) }
              </div>
            ) }
          </div>

          <div className="question-footer mt-auto mb-3">
            <div className="score d-flex justify-content-between">
              <h5>Score: { parseInt(correct_count / que_count * 100) }%</h5>
              <h5>Max Score: { parseInt((que_count - incorrect_count) / que_count * 100) }%</h5>
            </div>
            <Progress multi className="score-bar">
              <Progress bar color="dark" value={ correct_count } max={ que_count } />
              <Progress bar color="secondary" value={ incorrect_count } max={ que_count } />
              <Progress bar color="light" value={ que_count - (que_index - !isAnswered) - incorrect_count } max={ que_count } />
            </Progress>
          </div>
        </Container>
      }
    </div>
  )
}

export default App
