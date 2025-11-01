import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, className = '' }) => {
  return (
    <div className={`layout ${className}`}>
      <main className="main-content">
        {children}
      </main>
      
      <style jsx>{`
        .layout {
          min-height: 100vh;
          background-color: var(--page-bg);
          display: flex;
          flex-direction: column;
        }

        .main-content {
          flex: 1;
          padding: var(--spacing-lg) 0;
        }

        @media (max-width: 768px) {
          .main-content {
            padding: var(--spacing-md) 0;
          }
        }
      `}</style>
    </div>
  );
};

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fluid';
}

export const Container: React.FC<ContainerProps> = ({ 
  children, 
  className = '', 
  size = 'lg' 
}) => {
  return (
    <div className={`container container-${size} ${className}`}>
      {children}
      
      <style jsx>{`
        .container {
          width: 100%;
          margin: 0 auto;
          padding: 0 var(--spacing-md);
        }

        .container-sm { max-width: 640px; }
        .container-md { max-width: 768px; }
        .container-lg { max-width: 1024px; }
        .container-xl { max-width: 1280px; }
        .container-fluid { max-width: none; }

        @media (max-width: 768px) {
          .container {
            padding: 0 var(--spacing-sm);
          }
        }
      `}</style>
    </div>
  );
};

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  background?: 'default' | 'dark' | 'gradient';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Section: React.FC<SectionProps> = ({ 
  children, 
  className = '', 
  background = 'default',
  padding = 'lg'
}) => {
  return (
    <section className={`section section-${background} section-padding-${padding} ${className}`}>
      {children}
      
      <style jsx>{`
        .section {
          width: 100%;
        }

        .section-default {
          background-color: var(--page-bg);
        }

        .section-dark {
          background-color: var(--button-bg);
        }

        .section-gradient {
          background: linear-gradient(135deg, var(--page-bg) 0%, var(--button-bg) 100%);
        }

        .section-padding-sm { padding: var(--spacing-md) 0; }
        .section-padding-md { padding: var(--spacing-lg) 0; }
        .section-padding-lg { padding: var(--spacing-xl) 0; }
        .section-padding-xl { padding: var(--spacing-2xl) 0; }

        @media (max-width: 768px) {
          .section-padding-sm { padding: var(--spacing-sm) 0; }
          .section-padding-md { padding: var(--spacing-md) 0; }
          .section-padding-lg { padding: var(--spacing-lg) 0; }
          .section-padding-xl { padding: var(--spacing-xl) 0; }
        }
      `}</style>
    </section>
  );
};

interface GridProps {
  children: React.ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Grid: React.FC<GridProps> = ({ 
  children, 
  className = '', 
  cols = 3,
  gap = 'md'
}) => {
  return (
    <div className={`grid grid-cols-${cols} grid-gap-${gap} ${className}`}>
      {children}
      
      <style jsx>{`
        .grid {
          display: grid;
        }

        .grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
        .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
        .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
        .grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
        .grid-cols-5 { grid-template-columns: repeat(5, 1fr); }
        .grid-cols-6 { grid-template-columns: repeat(6, 1fr); }

        .grid-gap-sm { gap: var(--spacing-sm); }
        .grid-gap-md { gap: var(--spacing-md); }
        .grid-gap-lg { gap: var(--spacing-lg); }
        .grid-gap-xl { gap: var(--spacing-xl); }

        @media (max-width: 1200px) {
          .grid-cols-6 { grid-template-columns: repeat(4, 1fr); }
          .grid-cols-5 { grid-template-columns: repeat(4, 1fr); }
        }

        @media (max-width: 900px) {
          .grid-cols-4 { grid-template-columns: repeat(3, 1fr); }
          .grid-cols-3 { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 600px) {
          .grid-cols-3 { grid-template-columns: repeat(1, 1fr); }
          .grid-cols-2 { grid-template-columns: repeat(1, 1fr); }
        }
      `}</style>
    </div>
  );
};

interface FlexProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Flex: React.FC<FlexProps> = ({ 
  children, 
  className = '', 
  direction = 'row',
  align = 'start',
  justify = 'start',
  wrap = false,
  gap = 'md'
}) => {
  return (
    <div className={`flex flex-${direction} flex-align-${align} flex-justify-${justify} ${wrap ? 'flex-wrap' : ''} flex-gap-${gap} ${className}`}>
      {children}
      
      <style jsx>{`
        .flex {
          display: flex;
        }

        .flex-row { flex-direction: row; }
        .flex-column { flex-direction: column; }
        .flex-row-reverse { flex-direction: row-reverse; }
        .flex-column-reverse { flex-direction: column-reverse; }

        .flex-align-start { align-items: flex-start; }
        .flex-align-center { align-items: center; }
        .flex-align-end { align-items: flex-end; }
        .flex-align-stretch { align-items: stretch; }

        .flex-justify-start { justify-content: flex-start; }
        .flex-justify-center { justify-content: center; }
        .flex-justify-end { justify-content: flex-end; }
        .flex-justify-between { justify-content: space-between; }
        .flex-justify-around { justify-content: space-around; }
        .flex-justify-evenly { justify-content: space-evenly; }

        .flex-wrap { flex-wrap: wrap; }

        .flex-gap-sm { gap: var(--spacing-sm); }
        .flex-gap-md { gap: var(--spacing-md); }
        .flex-gap-lg { gap: var(--spacing-lg); }
        .flex-gap-xl { gap: var(--spacing-xl); }
      `}</style>
    </div>
  );
};
