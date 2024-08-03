import React from 'react';

const Day001 = () => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCount((count) => count + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);
  
  return (
    <div>
      <h1>Day 001</h1>
      <p>Count: {count}</p>
    </div>
  );
};

export default Day001;
