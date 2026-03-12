import React from 'react';
import cx from 'classnames';

export function Label({ className, ...props }) {
  return <label className={cx('block font-semibold mb-2.5', className)} {...props} />;
}

export const Input = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      className={cx('w-full p-2.5 border border-connector rounded-lg text-base', className)}
      type='text'
      ref={ref}
      {...props}
    />
  );
});

export function Required({ className, ...props }) {
  return (
    <span className={cx('text-red-incorrect', className)} {...props}>
      &#42;
    </span>
  );
}

export function Textarea({ className, ...props }) {
  return <textarea className={cx('w-full p-2.5 border border-connector rounded-lg text-base', className)} {...props} />;
}
