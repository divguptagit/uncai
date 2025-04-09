'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface AnimatedButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary';
}

export default function AnimatedButton({
  href,
  onClick,
  children,
  className = '',
  type = 'button',
  variant = 'primary',
}: AnimatedButtonProps) {
  const baseStyle = `inline-flex items-center justify-center px-6 py-3 font-medium rounded-md transition-all duration-200 ${
    variant === 'primary'
      ? 'text-white bg-blue-600 hover:bg-blue-700'
      : 'text-gray-300 bg-gray-800 hover:bg-gray-700'
  } ${className}`;

  const buttonContent = (
    <motion.div
      className="relative w-full h-full"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 10
      }}
    >
      <motion.span
        className="absolute inset-0 rounded-md bg-white opacity-0"
        whileHover={{ 
          opacity: [0, 0.1, 0],
          transition: { duration: 0.3 }
        }}
      />
      <span className="relative z-10">{children}</span>
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} className={baseStyle}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={baseStyle}>
      {buttonContent}
    </button>
  );
}
