import style from './card.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(style);

function card({ title, content }) {
    return (
        <div className="card">
            <h2 style={title === '' ? { display: 'none' } : {}}>{title}</h2>
            <img src={require('../../access/img/png/Picture1.png')} />
            {/* <p>{content}</p> */}
        </div>
    );
}

export default card;
