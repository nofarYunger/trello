export function BackgroundMenu({ backgrounds, onChangeBoardBg, goBack }) {
    return (
        <div className="background-menu-container">
            <button className="go-back-btn" onClick={goBack}>Go back</button>
            <ul className="background-menu clear-list flex space-between">
                {backgrounds.map(bg => {
                    return <div key={bg} onClick={() => onChangeBoardBg(bg)} className="bg-img-container" style={{ backgroundImage: bg }}>
                    </div>
                })}
            </ul>
        </div>
    )
}