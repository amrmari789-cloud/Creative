import * as React from "react"
import { cn } from "@/lib/utils"

// Custom Dialog Context
const DialogContext = React.createContext({
  open: false,
  onOpenChange: () => {},
})

// Dialog Root Component
const Dialog = ({ open, onOpenChange, children }) => {
  const [isOpen, setIsOpen] = React.useState(open || false)

  React.useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open)
    }
  }, [open])

  const handleOpenChange = React.useCallback((newOpen) => {
    setIsOpen(newOpen)
    onOpenChange?.(newOpen)
  }, [onOpenChange])

  // Close on Escape key
  React.useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        handleOpenChange(false)
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, handleOpenChange])

  // Prevent body scroll when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <DialogContext.Provider value={{ open: isOpen, onOpenChange: handleOpenChange }}>
      {children}
    </DialogContext.Provider>
  )
}

// Dialog Trigger
const DialogTrigger = React.forwardRef(({ className, children, asChild, ...props }, ref) => {
  const { onOpenChange } = React.useContext(DialogContext)

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      onClick: (e) => {
        onOpenChange(true)
        children.props.onClick?.(e)
      },
    })
  }

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onOpenChange(true)}
      className={className}
      {...props}
    >
      {children}
    </button>
  )
})
DialogTrigger.displayName = "DialogTrigger"

// Dialog Overlay
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => {
  const { open, onOpenChange } = React.useContext(DialogContext)

  if (!open) return null

  return (
    <div
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-in fade-in-0",
        className
      )}
      onClick={() => onOpenChange(false)}
      {...props}
    />
  )
})
DialogOverlay.displayName = "DialogOverlay"

// Dialog Content
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => {
  const { open, onOpenChange } = React.useContext(DialogContext)

  if (!open) return null

  return (
    <>
      <DialogOverlay />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          ref={ref}
          className={cn(
            "relative z-50 grid w-full max-w-lg gap-4 border bg-white p-6 shadow-lg duration-200 animate-in fade-in-0 zoom-in-95 slide-in-from-left-1/2 slide-in-from-top-[48%] sm:rounded-lg",
            className
          )}
          onClick={(e) => e.stopPropagation()}
          {...props}
        >
          {children}
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          >
            <span className="sr-only">Close</span>
            ✕
          </button>
        </div>
      </div>
    </>
  )
})
DialogContent.displayName = "DialogContent"

// Dialog Header
const DialogHeader = ({ className, ...props }) => (
  <div
    className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

// Dialog Footer
const DialogFooter = ({ className, ...props }) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

// Dialog Title
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
DialogTitle.displayName = "DialogTitle"

// Dialog Description
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = "DialogDescription"

// Dialog Close (for programmatic closing)
const DialogClose = React.forwardRef(({ className, children, ...props }, ref) => {
  const { onOpenChange } = React.useContext(DialogContext)

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onOpenChange(false)}
      className={className}
      {...props}
    >
      {children}
    </button>
  )
})
DialogClose.displayName = "DialogClose"

// Dialog Portal (no-op for custom implementation)
const DialogPortal = ({ children }) => children

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}

