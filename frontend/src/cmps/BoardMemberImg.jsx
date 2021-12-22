import Avatar from 'react-avatar';


export default function BoardMemberImg({ member, size = 30, className = null }) {

    return (
        //  <div className="task-member-img"><img className="task-member-preview-img" src={member?.imgUrl} /></div>
        <Avatar className={`task-member-preview-img ${className}`} alt="task-member-preview-img" name={member.fullname.toUpperCase()} size={size} textSizeRatio={1.75} fgColor='#fff' round={true} src={member.imgUrl} />
    )


}