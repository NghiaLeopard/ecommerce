import dynamic from 'next/dynamic'

const ReactDraftWysiwyg = dynamic(() => import('react-draft-wysiwyg').then(mod => mod.Editor), { ssr: false })

export default ReactDraftWysiwyg
