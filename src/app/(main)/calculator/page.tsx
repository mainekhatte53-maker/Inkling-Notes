'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CalculatorPage() {
  const [input, setInput] = useState('');
  const [previousInput, setPreviousInput] = useState('');
  const [operator, setOperator] = useState('');

  const handleNumberClick = (value: string) => {
    setInput((prev) => prev + value);
  };

  const handleOperatorClick = (op: string) => {
    if (input === '' && op === '-') {
      setInput('-');
      return;
    }
    if (input === '' || input === '-') return;
    if (previousInput !== '') {
      handleEqualsClick();
    }
    setPreviousInput(input);
    setInput('');
    setOperator(op);
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
  };

  const handleClearClick = () => {
    setInput('');
    setPreviousInput('');
    setOperator('');
  };

  const handleDecimalClick = () => {
    if (!input.includes('.')) {
      setInput(input + '.');
    }
  };

  const handleBackspaceClick = () => {
    setInput(input.slice(0, -1));
  };


  const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', '=', '+',
  ];

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

  return (
    <div className="flex justify-center items-center h-full">
      <Card className="w-full max-w-sm shadow-lg">
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
            {buttons.slice(3).map(btn => (
                <Button
                    key={btn}
                    variant={['/', '*', '-', '+', '='].includes(btn) ? 'default' : 'outline'}
                    onClick={() => handleButtonClick(btn)}
                    className={btn === '=' ? 'col-start-3' : ''}
                >
                    {btn}
                </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
