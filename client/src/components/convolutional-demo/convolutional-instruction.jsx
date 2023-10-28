import { useState, useEffect } from 'react';
import { useEncodeContext } from '../../pages/demo';

export default function ConvolutionalInstruction() {
  const [instruction, setInstruction] = useState('');
  const { setIsContentLoading } = useEncodeContext();

  useEffect(() => {
    fetch(`/convolutional/demo-instruction?state=encode`)
      .then(response => {
        setIsContentLoading(false);
        response.text().then(text => setInstruction(text));
      });
  }, [setIsContentLoading]);
  
  return <div>{instruction}</div>;
}