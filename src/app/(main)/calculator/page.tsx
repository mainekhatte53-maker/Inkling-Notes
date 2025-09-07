'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CalculatorPage() {
  const [input, setInput] = useState('0');
  const [previousInput, setPreviousInput] = useState('');
  const [operator, setOperator] = useState('');
  const [justCalculated, setJustCalculated] = useState(false);

  const handleNumberClick = (value: string) => {
    if (justCalculated || input === '0') {
      setInput(value);
      setJustCalculated(false);
    } else {
      setInput((prev) => prev + value);
    }
  };

  const handleOperatorClick = (op: string) => {
    if (input === '' && op === '-') {
      setInput('-');
      return;
    }
    if (input === '' || input === '-') return;

    if (previousInput !== '') {
      handleEqualsClick();
      setPreviousInput(input);
    } else {
      setPreviousInput(input);
    }
    
    setInput('');
    setOperator(op);
    setJustCalculated(false);
  };

  const handleEqualsClick = () => {
    if (previousInput === '' || input === '' || operator === '') return;
    
    const num1 = parseFloat(previousInput);
    const num2 = parseFloat(input);
    let result;

    switch (operator) {
      case '+':
        result = num1 + num2;
        break;
      case '-':
        result = num1 - num2;
        break;
      case '*':
        result = num1 * num2;
        break;
      case '/':
        if (num2 === 0) {
          result = 'Error';
        } else {
          result = num1 / num2;
        }
        break;
      default:
        return;
    }

    setInput(String(result));
    setPreviousInput('');
    setOperator('');
    setJustCalculated(true);
  };

  const handleClearClick = () => {
    setInput('0');
    setPreviousInput('');
    setOperator('');
    setJustCalculated(false);
  };

  const handleDecimalClick = () => {
    if (justCalculated) {
        setInput('0.');
        setJustCalculated(false);
    } else if (!input.includes('.')) {
        setInput(input + '.');
    }
  };

  const handleBackspaceClick = () => {
    if (justCalculated) return;
    setInput(input.slice(0, -1) || '0');
  };

  const handleButtonClick = (btn: string) => {
    if(!isNaN(Number(btn))) {
      handleNumberClick(btn);
    } else if (['+', '-', '*', '/'].includes(btn)) {
      handleOperatorClick(btn);
    } else if (btn === '.') {
      handleDecimalClick();
    } else if (btn === '=') {
      handleEqualsClick();
    }
  }

  const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', '=', '+',
  ];

  return (
    <div className="flex justify-center items-center h-full">
      <Card className="w-full max-w-xs shadow-lg">
        <CardHeader>
          <CardTitle>Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted rounded-lg p-4 mb-4 text-right text-3xl font-mono truncate">
            {input || previousInput || '0'}
          </div>
          <div className="grid grid-cols-4 gap-2">
            <Button variant="outline" className="col-span-2" onClick={handleClearClick}>C</Button>
            <Button variant="outline" onClick={handleBackspaceClick}>&larr;</Button>
            <Button variant="outline" onClick={() => handleOperatorClick('/')}>/</Button>
            
            <Button variant="outline" onClick={() => handleNumberClick('7')}>7</Button>
            <Button variant="outline" onClick={() => handleNumberClick('8')}>8</Button>
            <Button variant="outline" onClick={() => handleNumberClick('9')}>9</Button>
            <Button variant="outline" onClick={() => handleOperatorClick('*')}>*</Button>
            
            <Button variant="outline" onClick={() => handleNumberClick('4')}>4</Button>
            <Button variant="outline" onClick={() => handleNumberClick('5')}>5</Button>
            <Button variant="outline" onClick={() => handleNumberClick('6')}>6</Button>
            <Button variant="outline" onClick={() => handleOperatorClick('-')}>-</Button>

            <Button variant="outline" onClick={() => handleNumberClick('1')}>1</Button>
            <Button variant="outline" onClick={() => handleNumberClick('2')}>2</Button>
            <Button variant="outline" onClick={() => handleNumberClick('3')}>3</Button>
            <Button variant="outline" onClick={() => handleOperatorClick('+')}>+</Button>

            <Button variant="outline" className="col-span-2" onClick={() => handleNumberClick('0')}>0</Button>
            <Button variant="outline" onClick={handleDecimalClick}>.</Button>
            <Button onClick={handleEqualsClick}>=</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
