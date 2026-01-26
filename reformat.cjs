const fs = require('fs');
const content = fs.readFileSync('src/data/replies.ts', 'utf8');
const start = content.indexOf('[');
const end = content.lastIndexOf(']');
const arrayContent = content.substring(start, end + 1);
const REPLY_DATA = JSON.parse(arrayContent);

let output = 'export const REPLY_DATA = [\n';
REPLY_DATA.forEach((item, index) => {
  output += '  {\n';
  output += `    handle: '${item.handle}',\n`;
  output += '    reply: {\n';
  output += `      from: '${item.reply.from}',\n`;
  output += `      subject: '${item.reply.subject}',\n`;
  output += `      body: 	${item.reply.body}	,
`;
  output += `      timestamp: '${item.reply.timestamp}'\n`;
  output += '    }\n';
  output += '  }' + (index === REPLY_DATA.length - 1 ? '' : ',') + '\n';
});
output += '];\n';

fs.writeFileSync('src/data/replies.ts', output);
