"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  AlertTriangle,
  Upload,
  Clock,
  BarChart,
  ArrowLeft,
  Loader2,
  Car,
  Users,
  Shield,
  Moon,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export default function UserDashboard() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    // Check if file is an image
    if (!file.type.match("image.*")) {
      alert("Please upload an image file (jpg or png)")
      return
    }

    setFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Reset analysis
    setAnalysisResult(null)
  }

  const handleAnalyze = () => {
    if (!file) return

    setIsAnalyzing(true)

    // Simulate API call with timeout
    setTimeout(() => {
      // Mock analysis result
      const mockResult = {
        summary:
          "This image appears to show a road traffic accident involving two vehicles. The collision seems to have occurred at an intersection during nighttime. There is moderate damage to both vehicles, with the front of one car significantly impacted. Several people are gathered around the scene, possibly including emergency responders.",
        details:
          "The accident appears to have resulted in moderate severity damage. There are visible signs of airbag deployment in at least one vehicle, suggesting a significant impact. The positioning of the vehicles indicates a possible T-bone collision at the intersection. There is potential hazard from leaked fluids on the road surface, which could pose slip risks or fire hazards if ignition sources are present.",
        severity: "Moderate",
        confidence: 92,
        timestamp: new Date().toISOString(),
        tags: ["Road Accident", "Nighttime", "Multiple Vehicles", "Crowd Present", "Police Present"],
        recommendations: [
          "Ensure emergency services have been notified",
          "Establish a safe perimeter around the vehicles",
          "Check for fuel or fluid leakage",
          "Direct traffic away from the scene",
          "Gather witness statements if possible",
        ],
      }

      setAnalysisResult(mockResult)
      setIsAnalyzing(false)
    }, 3000)
  }

  const handleReset = () => {
    setFile(null)
    setPreview(null)
    setAnalysisResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-accent-orange mr-2" />
              <h1 className="text-3xl font-bold">Incident Analysis</h1>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
          <p className="text-muted-foreground">Upload an incident photo to generate AI-powered analysis and insights</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Upload Incident Photo</CardTitle>
                <CardDescription>Drag and drop or select an incident photo (.jpg, .png)</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`drop-area rounded-lg h-64 flex flex-col items-center justify-center cursor-pointer p-4 ${
                    isDragging ? "active" : ""
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {preview ? (
                    <div className="relative w-full h-full">
                      <img
                        src={preview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </div>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-center text-muted-foreground">
                        Drag and drop your incident photo here or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">Supports JPG, PNG</p>
                    </>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInput}
                    accept=".jpg,.jpeg,.png"
                    className="hidden"
                  />
                </div>

                {file && (
                  <div className="mt-4">
                    <p className="text-sm font-medium">Selected file:</p>
                    <p className="text-sm text-muted-foreground">{file.name}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col space-y-3">
                <Button className="w-full" onClick={handleAnalyze} disabled={!file || isAnalyzing}>
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Image"
                  )}
                </Button>
                {file && (
                  <Button variant="outline" className="w-full" onClick={handleReset} disabled={isAnalyzing}>
                    Reset
                  </Button>
                )}
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <AnimatePresence mode="wait">
              {isAnalyzing ? (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full flex flex-col justify-center items-center p-8">
                    <div className="relative">
                      <AlertTriangle className="h-16 w-16 text-accent-orange animate-pulse-accent" />
                      <div className="absolute inset-0 rounded-full border-4 border-t-accent-orange border-r-transparent border-b-transparent border-l-transparent animate-spin-slow"></div>
                    </div>
                    <h3 className="text-xl font-medium mt-6 mb-2">Analyzing Incident</h3>
                    <p className="text-muted-foreground text-center mb-6">
                      Our AI is examining the incident details, severity, and potential hazards
                    </p>
                    <Progress value={45} className="w-full max-w-md" />
                  </Card>
                </motion.div>
              ) : analysisResult ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Analysis Results</CardTitle>
                        <Badge variant="outline" className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date().toLocaleTimeString()}
                        </Badge>
                      </div>
                      <CardDescription>AI-generated insights for the uploaded incident</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <h4 className="font-medium">Summary</h4>
                        <p className="text-sm text-muted-foreground">{analysisResult.summary}</p>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium">Detailed Analysis</h4>
                        <p className="text-sm text-muted-foreground">{analysisResult.details}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Severity</p>
                          <div className="flex items-center">
                            <AlertCircle className="h-5 w-5 text-accent-orange mr-2" />
                            <span className="font-medium">{analysisResult.severity}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Confidence</p>
                          <div className="flex items-center">
                            <BarChart className="h-5 w-5 text-accent-orange mr-2" />
                            <span className="font-medium">{analysisResult.confidence}%</span>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-medium mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.tags.map((tag: string, index: number) => {
                            // Choose icon based on tag
                            let TagIcon = AlertTriangle
                            if (tag.includes("Road") || tag.includes("Vehicle")) TagIcon = Car
                            if (tag.includes("Crowd")) TagIcon = Users
                            if (tag.includes("Police")) TagIcon = Shield
                            if (tag.includes("Night")) TagIcon = Moon

                            return (
                              <Badge key={index} variant="secondary" className="flex items-center gap-1 py-1.5">
                                <TagIcon className="h-3 w-3" />
                                {tag}
                              </Badge>
                            )
                          })}
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-medium mb-2">Recommendations</h4>
                        <ul className="space-y-2">
                          {analysisResult.recommendations.map((rec: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <AlertTriangle className="h-4 w-4 text-accent-orange mr-2 mt-0.5 shrink-0" />
                              <span className="text-sm">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" onClick={handleReset}>
                        Upload Another Image
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full flex flex-col justify-center items-center p-8 border-dashed">
                    <div className="rounded-full bg-muted p-4 mb-4">
                      <AlertTriangle className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">No Analysis Yet</h3>
                    <p className="text-muted-foreground text-center max-w-md">
                      Upload an incident photo and click "Analyze Image" to receive AI-powered insights
                    </p>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
