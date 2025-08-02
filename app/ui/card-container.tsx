import { ReactNode } from 'react';

interface CardContainerProps {
  children: ReactNode;
  css: string
}

const CardContainer = ({ children, css }: CardContainerProps) => {
  return (
    <div className={`${css} overflow-x-auto flex gap-12 justify-start scroll-smooth`}>
      {children}
    </div>
  );
};

export default CardContainer;
