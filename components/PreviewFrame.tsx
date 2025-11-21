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
      return '<div style="padding: 20px; font-family: sans-serif; color: #64748b;">index.html not found</div>';
    }

    let content = htmlFile.content;

    // Inject CSS directly to ensure it renders in the iframe
    if (cssFile) {
      // Remove existing link to style.css to avoid 404s
      content = content.replace(/<link[^>]*href=["']style\.css["'][^>]*>/g, '');
      content = content.replace('</head>', `<style>\n${cssFile.content}\n</style>\n</head>`);
    }

    // Inject JS directly
    if (jsFile) {
      // Remove existing script tag for script.js
      content = content.replace(/<script[^>]*src=["']script\.js["'][^>]*><\/script>/g, '');
      content = content.replace('</body>', `<script>\n${jsFile.content}\n</script>\n</body>`);
    }

    return content;
  }, [files]);

  return (
    <div className="h-full w-full bg-white flex flex-col">
      <iframe
        title="Project Preview"
        srcDoc={srcDoc}
        className="w-full h-full bg-white"
        sandbox="allow-scripts allow-modals allow-forms allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );
};

export default PreviewFrame;