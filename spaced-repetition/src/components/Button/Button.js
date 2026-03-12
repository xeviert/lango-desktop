import React from 'react'
import cx from 'classnames'

const Button = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <button className={cx(className)} ref={ref} {...props} />
  )
})

export default Button
