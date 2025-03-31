import React from 'react'
import { useState, useEffect } from 'react'

const FeedbackForm = () => {
    const [text, setUserText] = useState("")
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ sentiment: string; confidence: number } | null>(null);
    const handleSubmit = async (e?: React.FormEvent) =>{
        if (e) e.preventDefault()
        setLoading(true)
        setResult(null)

        try {
            const response = await fetch("http://127.0.0.1:8000/analyze", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ text }),
            });
            if (!response.ok){
                throw new Error("API Request Failed")
            }

            const data = await response.json()
            setResult({
                sentiment: data.sentiment,
                confidence: data.confidence
            })
        }
        catch(error) {
            console.error("Error analyzing feedback:", error)
            alert("Something went wrong, check the console.")
        }
        finally{
            setLoading(false)
        }
    }


  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          className="mr-2 text-white border border-white rounded h-9 text-lg"
          type="text"
          value={text}
          onChange={(e) => setUserText(e.target.value)}
          placeholder="Type your feedback"
          disabled={loading}
        />
      </form>
      <button type="submit" disabled={loading || text.trim() === ""}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>
      {result && (
        <div>
          <p>
            Sentiment:{" "}
            <strong
              className={
                result.sentiment == "negative"
                  ? "text-red-600"
                  : "text-blue-600"
              }
            >
              {result.sentiment}
            </strong>
          </p>
          <p>Confidence: {result.confidence.toFixed(2)}</p>
        </div>
      )}
    </>
  );
}

export default FeedbackForm