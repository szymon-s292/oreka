import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  css?: string;
}

const Card = ({ children, css = '' }: CardProps) => {
  return (
    <div className={`bg-white shadow-md rounded-lg p-6 flex flex-col ${css}`}>
      {children}
    </div>
  );
};

export default Card;
