"use client"

import { useTransactionStore } from "@/store/useStore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import {
    Utensils,
    Car,
    Tv,
    Zap,
    HelpCircle,
    Palette,
    Database,
    ShieldCheck,
    Trash2,
    Download,
    Bell,
    Globe
} from "lucide-react"
import ErrorBoundary from "@/components/common/ErrorBoundary"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { useTheme } from "next-themes"

const categoryIcons: Record<string, React.ElementType> = {
    food: Utensils,
    transport: Car,
    entertainment: Tv,
    utilities: Zap,
    other: HelpCircle,
}

export default function SettingsPage() {
    const { budgetGoals, setBudgetGoal } = useTransactionStore()
    const { theme, setTheme } = useTheme()

    const handleClearData = () => {
        if (confirm("Are you absolutely sure? This will delete all transactions and budget goals. This cannot be undone.")) {
            localStorage.clear()
            window.location.reload()
        }
    }

    const handleExportBackup = () => {
        const data = {
            transactions: JSON.parse(localStorage.getItem('transaction-storage') || '{}'),
            exportDate: new Date().toISOString()
        }
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `budget-flow-backup-${new Date().toISOString().split('T')[0]}.json`
        a.click()
        toast.success("Backup exported successfully")
    }

    return (
        <ErrorBoundary>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8 max-w-4xl mx-auto"
            >
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground mt-1">
                        Control your experience and manage your data.
                    </p>
                </div>

                <Tabs defaultValue="budgets" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex bg-muted/50 p-1 h-auto gap-1">
                        <TabsTrigger value="budgets" className="py-2.5 px-6 gap-2">
                            <ShieldCheck className="h-4 w-4" /> Budgets
                        </TabsTrigger>
                        <TabsTrigger value="appearance" className="py-2.5 px-6 gap-2">
                            <Palette className="h-4 w-4" /> Appearance
                        </TabsTrigger>
                        <TabsTrigger value="data" className="py-2.5 px-6 gap-2">
                            <Database className="h-4 w-4" /> Data
                        </TabsTrigger>
                    </TabsList>

                    <div className="mt-8 space-y-6">
                        {/* Budgets Tab */}
                        <TabsContent value="budgets" className="outline-none">
                            <Card className="border-muted shadow-sm">
                                <CardHeader>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                            <ShieldCheck className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <CardTitle>Category Budgets</CardTitle>
                                            <CardDescription>Define monthly limits to keep your spending in check.</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {Object.entries(budgetGoals).map(([category, limit]) => {
                                        const Icon = categoryIcons[category] || HelpCircle
                                        return (
                                            <div key={category} className="space-y-3 group p-4 rounded-xl border border-transparent hover:border-muted hover:bg-muted/30 transition-all">
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-muted rounded-lg group-hover:bg-background transition-colors">
                                                            <Icon className="h-4 w-4 text-muted-foreground" />
                                                        </div>
                                                        <Label htmlFor={category} className="capitalize font-semibold text-base">
                                                            {category}
                                                        </Label>
                                                    </div>
                                                    <span className="text-sm font-medium text-muted-foreground">Monthly</span>
                                                </div>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-semibold">LKR</span>
                                                    <Input
                                                        id={category}
                                                        type="number"
                                                        className="pl-14 h-11 bg-background border-muted focus-visible:ring-primary"
                                                        value={limit}
                                                        onChange={(e) => setBudgetGoal(category, parseFloat(e.target.value) || 0)}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </CardContent>
                                <CardFooter className="bg-muted/30 border-t p-4 flex justify-between">
                                    <p className="text-xs text-muted-foreground">Changes are saved automatically.</p>
                                    <Button variant="ghost" size="sm" onClick={() => toast.info("Goal reset requested - not implemented")}>Reset All Goals</Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        {/* Appearance Tab */}
                        <TabsContent value="appearance" className="outline-none space-y-6">
                            <Card className="border-muted shadow-sm">
                                <CardHeader>
                                    <CardTitle>Visual Preferences</CardTitle>
                                    <CardDescription>Customize how BudgetFlow looks on your device.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                                        <div className="space-y-0.5">
                                            <div className="flex items-center gap-2">
                                                <Palette className="h-4 w-4" />
                                                <Label className="text-base font-semibold">Dark Mode</Label>
                                            </div>
                                            <p className="text-sm text-muted-foreground">Switch between light and dark themes.</p>
                                        </div>
                                        <Switch
                                            checked={theme === 'dark'}
                                            onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 opacity-60">
                                        <div className="space-y-0.5">
                                            <div className="flex items-center gap-2">
                                                <Globe className="h-4 w-4" />
                                                <Label className="text-base font-semibold">Currency Display</Label>
                                            </div>
                                            <p className="text-sm text-muted-foreground">LKR (Sri Lankan Rupee)</p>
                                        </div>
                                        <Button variant="outline" size="sm" disabled>Change</Button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                                        <div className="space-y-0.5">
                                            <div className="flex items-center gap-2">
                                                <Bell className="h-4 w-4" />
                                                <Label className="text-base font-semibold">Native Notifications</Label>
                                            </div>
                                            <p className="text-sm text-muted-foreground">Get alerts for budget thresholds.</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Data Tab */}
                        <TabsContent value="data" className="outline-none space-y-6">
                            <Card className="border-muted shadow-sm">
                                <CardHeader>
                                    <CardTitle>Data Management</CardTitle>
                                    <CardDescription>Export your data or start over with a clean slate.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="font-semibold flex items-center gap-2">
                                                <Download className="h-4 w-4 text-blue-500" />
                                                Export Local Backup
                                            </p>
                                            <p className="text-sm text-muted-foreground">Download a JSON file containing all your local data.</p>
                                        </div>
                                        <Button onClick={handleExportBackup} variant="secondary" className="gap-2">
                                            Export JSON
                                        </Button>
                                    </div>

                                    <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="font-semibold text-rose-600 flex items-center gap-2">
                                                <Trash2 className="h-4 w-4" />
                                                Wipe Local Storage
                                            </p>
                                            <p className="text-sm text-muted-foreground">Permanently delete all data. This action is irreversible.</p>
                                        </div>
                                        <Button onClick={handleClearData} variant="destructive">
                                            Wipe All Data
                                        </Button>
                                    </div>
                                </CardContent>
                                <CardFooter className="bg-muted/30 border-t p-4">
                                    <p className="text-xs text-muted-foreground">Your data is stored locally in your browser and is never uploaded to a server.</p>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </div>
                </Tabs>
            </motion.div>
        </ErrorBoundary>
    )
}
