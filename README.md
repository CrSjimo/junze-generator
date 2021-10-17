# JUNZE GENERATOR

俊泽生成器。

## 用法

从npm安装：

```bash
npm install junze-generator
```

然后用：

```typescript
import { generate, registerCorpus } from 'junze-generator';

registerCorpus(...); //用NLP模式之前得先注册词库
generate('俊泽不在的第%d天，%c他。', new Date('2021-04-28'));
```

## 协议

MIT。