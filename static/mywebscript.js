// Emotion Detection Script with Error Handling and Security

let RunSentimentAnalysis = () => {
    const textToAnalyze = document.getElementById("textToAnalyze").value.trim();
    
    // Validate input
    if (!textToAnalyze) {
        displayError("Please enter some text to analyze.");
        return;
    }
    
    // Disable button during analysis
    const analyzeButton = document.getElementById("analyzeButton");
    if (analyzeButton) {
        analyzeButton.disabled = true;
        analyzeButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Analyzing...';
    }
    
    // Clear previous results
    document.getElementById("system_response").innerHTML = '<div class="text-center"><div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div></div>';
    
    // Create XMLHttpRequest
    const xhttp = new XMLHttpRequest();
    
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4) {
            // Re-enable button
            if (analyzeButton) {
                analyzeButton.disabled = false;
                analyzeButton.innerHTML = 'Run Sentiment Analysis';
            }
            
            if (this.status === 200) {
                try {
                    const response = JSON.parse(this.responseText);
                    displayResults(response);
                } catch (e) {
                    displayError("Invalid response from server.");
                }
            } else {
                displayError(`Error ${this.status}: ${this.statusText}`);
            }
        }
    };
    
    // Handle network errors
    xhttp.onerror = function() {
        if (analyzeButton) {
            analyzeButton.disabled = false;
            analyzeButton.innerHTML = 'Run Sentiment Analysis';
        }
        displayError("Network error. Please check your connection and try again.");
    };
    
    // Build URL with proper encoding
    const url = "emotionDetector?textToAnalyze=" + encodeURIComponent(textToAnalyze);
    
    xhttp.open("GET", url, true);
    xhttp.send();
};

// Display sentiment analysis results
function displayResults(data) {
    if (data.error) {
        displayError(data.error);
        return;
    }
    
    const html = `
        <div class="alert alert-info" role="alert">
            <h5 class="alert-heading">Analysis Results</h5>
            <p><strong>Text Analyzed:</strong> ${sanitizeHTML(data.text_analyzed)}</p>
            <p><strong>Sentiment:</strong> <span class="badge badge-${data.sentiment === 'Positive' ? 'success' : data.sentiment === 'Negative' ? 'danger' : 'secondary'}">${data.sentiment}</span></p>
            <p><strong>Emotion:</strong> ${data.emotion}</p>
            <p><strong>Confidence:</strong> ${data.confidence}%</p>
        </div>
    `;
    
    document.getElementById("system_response").innerHTML = html;
}

// Sanitize HTML to prevent XSS attacks
function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

// Display error messages
function displayError(message) {
    document.getElementById("system_response").innerHTML = `
        <div class="alert alert-danger" role="alert">
            <strong>Error:</strong> ${message}
        </div>
    `;
}

// Clear results function
function clearResults() {
    document.getElementById("textToAnalyze").value = '';
    document.getElementById("system_response").innerHTML = '<p class="text-muted text-center">Results will appear here...</p>';
}

// Add event listener for form submission
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('emotionForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            RunSentimentAnalysis();
        });
    }
});
