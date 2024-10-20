import { v4 as uuidv4 } from 'uuid';

interface FormattedBlock {
  content: string;
  indent: number;
  children: FormattedBlock[];
}

// 新增的 formatAnswer 函數
export function formatAnswer(answer: string): FormattedBlock[] {
    console.log("Starting formatAnswer with input:", answer);
    const lines = answer.split('\n');
    const formattedBlocks: FormattedBlock[] = [];
    let currentBlock: FormattedBlock | null = null;
    let isInMathBlock = false;
    let isInSpecialBlock = false;
    let specialBlockType = '';
    let hasRendererMacro = false;
    let lastIndentLevel = 0;
    let listIndentStack: number[] = [];

    // 獲取特殊標籤列表
    const specialTags = (logseq.settings?.specialTags as string || "mermaid,viz,dot,graphviz").split(',').map(tag => tag.trim().toLowerCase());

    const pushCurrentBlock = () => {
        if (currentBlock) {
            if (currentBlock.indent === 0 || formattedBlocks.length === 0) {
                formattedBlocks.push(currentBlock);
            } else {
                let parent = formattedBlocks[formattedBlocks.length - 1];
                while (parent.children.length > 0 && parent.indent >= currentBlock.indent) {
                    parent = parent.children[parent.children.length - 1];
                }
                if (parent.indent < currentBlock.indent) {
                    parent.children.push(currentBlock);
                } else {
                    formattedBlocks.push(currentBlock);
                }
            }
            currentBlock = null;
        }
    };

    for (const line of lines) {
        let trimmedLine = line.trim();
        const indentMatch = line.match(/^(\s*)/);
        let indentLevel = indentMatch ? Math.floor(indentMatch[1].length / 2) : 0;

        // 替換 ```dot 為 ```graphviz
        if (trimmedLine.startsWith('```dot')) {
            trimmedLine = trimmedLine.replace('```dot', '```graphviz');
        }

        // 檢查特殊塊的開始
        if (trimmedLine.startsWith('```') && !isInSpecialBlock) {
            pushCurrentBlock();
            isInSpecialBlock = true;
            specialBlockType = trimmedLine.slice(3).toLowerCase() // 獲取特殊塊類型
            
            // 將 dot 替換為 graphviz（這裡保留以防萬一）
            if (specialBlockType === 'dot') {
                specialBlockType = 'graphviz'
            }
            
            const uuid = uuidv4()
            
            // 插入渲染器宏，只在第一次遇到特殊塊時插入
            if (specialTags.includes(specialBlockType) && !hasRendererMacro) {
                console.log(`Inserting renderer macro for ${specialBlockType}`);
                const scale = specialBlockType === 'graphviz' ? 1 : 3;
                formattedBlocks.push({ 
                    content: `{{renderer :${specialBlockType}_${uuidv4()}, ${scale}}}`,
                    indent: indentLevel,
                    children: []
                });
                hasRendererMacro = true
            }
            
            // 使用更新後的 specialBlockType
            currentBlock = { content: '```' + specialBlockType + '\n', indent: indentLevel, children: [] };
            continue
        }

        // 檢查特殊塊的結束
        if (trimmedLine === '```' && isInSpecialBlock) {
            if (currentBlock) {
                currentBlock.content += line + '\n';
                pushCurrentBlock();
            }
            isInSpecialBlock = false;
            specialBlockType = '';
            continue
        }

        if (isInSpecialBlock) {
            if (currentBlock) {
                currentBlock.content += line + '\n';
            }
            continue
        }

        // 檢查數學公式區塊
        if (trimmedLine.startsWith('$$') && !isInMathBlock) {
            pushCurrentBlock();
            isInMathBlock = true;
            currentBlock = { content: line + '\n', indent: indentLevel, children: [] };
            continue
        } else if (trimmedLine.endsWith('$$') && isInMathBlock) {
            if (currentBlock) {
                currentBlock.content += line + '\n';
                pushCurrentBlock();
            }
            isInMathBlock = false;
            continue
        }

        if (isInMathBlock) {
            if (currentBlock) {
                currentBlock.content += line + '\n';
            }
            continue
        }

        // 處理標題和列表項
        const listItemMatch = line.match(/^(\s*)([-*]|\d+\.)\s(.+)/);
        if (listItemMatch) {
            pushCurrentBlock();
            const [, indent, listMarker, content] = listItemMatch;
            const rawIndentLevel = Math.floor(indent.length / 2);

            // 處理列表缩进
            while (listIndentStack.length > 0 && rawIndentLevel <= listIndentStack[listIndentStack.length - 1]) {
                listIndentStack.pop();
            }
            listIndentStack.push(rawIndentLevel);
            indentLevel = listIndentStack.length - 1;

            // 如果是有序列表，保留数字
            const formattedContent = listMarker.match(/\d+\./) ? `${listMarker} ${content}` : content;
            currentBlock = { content: formattedContent, indent: indentLevel, children: [] };
        } else if (line.match(/^#{1,6}\s/) || trimmedLine === '' || indentLevel !== lastIndentLevel) {
            pushCurrentBlock();
            listIndentStack = []; // 重置列表缩进栈
            currentBlock = { content: trimmedLine, indent: indentLevel, children: [] };
        } else if (currentBlock) {
            currentBlock.content += '\n' + trimmedLine;
        } else {
            currentBlock = { content: trimmedLine, indent: indentLevel, children: [] };
        }

        lastIndentLevel = indentLevel;
    }

    pushCurrentBlock();

    console.log("Formatted blocks:", formattedBlocks);
    return formattedBlocks
}

export const createKanbanBoard = () => {
    // ... (other code)

    const newColumns = defaultColumns.map((column) => {
        return {
            id: uuidv4(),  // Use uuidv4() directly here
            name: column,
            tasks: []
        }
    })

    // ... (rest of the function)
}
