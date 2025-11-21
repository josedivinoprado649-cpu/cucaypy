import React, { useMemo } from 'react';
import { ProjectFile } from '../types';

interface PreviewFrameProps {
  files: ProjectFile[];
}

const PreviewFrame: React.FC<PreviewFrameProps> = ({ files }) => {
  const srcDoc = useMemo(() => {
    const htmlFile = files.find(f => f.name === 'index.html');
    const cssFile = files.find(f => f.name === 'style.css');
    const jsFile = files.find(f => f.name === 'script.js');

    if (!htmlFile) {
      return '<div style="display:flex;height:100vh;align-items:center;justify-content:center;color:#64748b;font-family:sans-serif;">index.html not found</div>';
    }

    let content = htmlFile.content;

    // Inject CSS directly to ensure it renders in the iframe
    // Uses regex that handles attributes in any order and different quoting styles
    if (cssFile) {
      const cssLinkRegex = /<link\s+[^>]*href=["']style\.css["'][^>]*>/gi;
      content = content.replace(cssLinkRegex, '');
      // Inject before head close or body open, or at the end if neither exists
      const styleTag = `<style>\n/* Injected style.css */\n${cssFile.content}\n</style>`;
      if (content.includes('</head>')) {
        content = content.replace('</head>', `${styleTag}\n</head>`);
      } else {
        content = styleTag + content;
      }
    }

    // Inject JS directly
    if (jsFile) {
      const jsScriptRegex = /<script\s+[^>]*src=["']script\.js["'][^>]*>\s*<\/script>/gi;
      content = content.replace(jsScriptRegex, '');
      
      const scriptTag = `<script>\n/* Injected script.js */\ntry {\n${jsFile.content}\n} catch(err) { console.error('Runtime Error:', err); document.body.innerHTML += '<div style="position:fixed;top:0;left:0;background:red;color:white;padding:10px;z-index:9999">JS Error: ' + err.message + '</div>'; }\n</script>`;
      
      if (content.includes('</body>')) {
        content = content.replace('</body>', `${scriptTag}\n</body>`);
      } else {
        content = content + scriptTag;
      }
    }

    return content;
  }, [files]);

  return (
    <div className="h-full w-full bg-white flex flex-col">
      <iframe
        title="Project Preview"
        srcDoc={srcDoc}
        className="w-full h-full bg-white border-0"
        sandbox="allow-scripts allow-modals allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin"
      />
    </div>
  );
};

export default PreviewFrame;