import './style.scss';

function InfoRead({ text, style }) {
    return (
        <div style={style} className="info-read">
            {text}
        </div>
    );
}

export default InfoRead;
