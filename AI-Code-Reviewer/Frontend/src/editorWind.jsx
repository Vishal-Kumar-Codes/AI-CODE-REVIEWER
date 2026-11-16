import React, { useState } from 'react';
import './App.css';
import prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-java';
import 'prismjs/themes/prism-tomorrow.css';
import Editor from 'react-simple-code-editor';
import axios from 'axios';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const LANGUAGES = {
  java: {
    label: 'Java',
    prism: 'java',
    template: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
  },
  cpp: {
    label: 'C++',
    prism: 'cpp',
    template: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
  },
  c: {
    label: 'C',
    prism: 'c',
    template: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
  },
  javascript: {
    label: 'JavaScript',
    prism: 'javascript',
    template: `console.log("Hello, World!");`,
  },
};

function EditorWind() {
  const [lang, setLang] = useState('java');
  const [code, setCode] = useState(LANGUAGES.java.template);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);

  const current = LANGUAGES[lang];

  function changeLang(e) {
    const next = e.target.value;
    setLang(next);
    setCode(LANGUAGES[next].template);
  }

  async function reviewCode() {
    if (!code.trim()) {
      setReview('Please write some code first.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/ai/get-response`, {
        code: `Language: ${current.label}\n\n${code}`,
      });
      setReview(response.data);
    } catch (error) {
      setReview(
        error.response?.status === 429
          ? `### ⏳ Slow down a little

Too many requests. Please wait a minute and try again.`
          : error.response?.status === 503
          ? `### 🚦 Oops, the server is busy

The AI is facing high demand right now. Please wait a few seconds and try again.`
          : `### ⚠️ Something went wrong

We could not review your code. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="main">
      <section className="panel">
        <div className="toolbar">
          <label>
            <span>Language</span>
            <select value={lang} onChange={changeLang}>
              {Object.entries(LANGUAGES).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </label>
          <button onClick={() => setCode('')} className="ghost" type="button">Clear</button>
          <button onClick={reviewCode} className="button" disabled={loading} type="button">
            {loading ? 'Reviewing…' : 'Review Code'}
          </button>
        </div>
        <div className="code">
          <Editor
            value={code}
            onValueChange={setCode}
            highlight={(c) => prism.highlight(c, prism.languages[current.prism], current.prism)}
            padding={14}
            textareaClassName="editor-textarea"
            style={{
              fontFamily: '"Fira Code", "Fira Mono", Consolas, monospace',
              fontSize: 14,
              minHeight: '100%',
              color: '#f8f8f2',
            }}
          />
        </div>
      </section>
      <section className="panel result">
        <div className="panel-title">AI Review</div>
        <div className="result-body">
          {loading ? (
            <div className="loading-box"><div className="spinner" /><p>Analyzing your code…</p></div>
          ) : review ? (
            <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
          ) : (
            <p className="placeholder">Pick a language to load a starter template, or paste your code, then click “Review Code”.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default EditorWind;
