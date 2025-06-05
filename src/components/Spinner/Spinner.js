import css from './Spinner.module.less';

export default function Spinner(props) {
  return (
    <div {...props}>
        <div className={css.Spinner}></div>
    </div>
  )
}