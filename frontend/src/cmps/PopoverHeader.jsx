import CloseIcon from '@material-ui/icons/Close';

export function PopoverHeader({ title, setCurrPopover, className }) {

    return <div className={`popover-header flex align-center justify-center ${className && className}`}>
        <span className="popover-header-title">{title}</span>
        <CloseIcon className="close-icon" onClick={setCurrPopover} />
    </div>
}