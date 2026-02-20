"use client"

import React, { Component, ErrorInfo, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCcw } from "lucide-react"

interface Props {
    children?: ReactNode
}

interface State {
    hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    }

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo)
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-[400px] flex-col items-center justify-center p-6 text-center">
                    <div className="mb-4 rounded-full bg-rose-100 p-3 dark:bg-rose-900/20">
                        <AlertCircle className="h-10 w-10 text-rose-600" />
                    </div>
                    <h2 className="mb-2 text-2xl font-bold tracking-tight">Something went wrong</h2>
                    <p className="mb-6 text-muted-foreground max-w-md">
                        We encountered an unexpected error. Try refreshing the page or contact support if the problem persists.
                    </p>
                    <Button
                        onClick={() => this.setState({ hasError: false })}
                        className="gap-2"
                    >
                        <RefreshCcw className="h-4 w-4" />
                        Try Again
                    </Button>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
