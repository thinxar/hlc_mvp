interface IOptions {
  height?: string
}
const SectionBreak = (props: IOptions) => {
  const height = props.height || '1em';
  return (
    <div style={{ height: height }}></div>
  )
}

type GutterProps = {
  children: React.ReactNode
}

const Gutter = ({ children }: GutterProps) => {
  return (
    <div className="w-full mx-auto transition-all duration-300
      max-w-[95vw] 
      md:max-w-[80vw] 
      xl:max-w-[75vw]">
      {children}
    </div>
  )
}

export default Gutter


export { SectionBreak, Gutter }
