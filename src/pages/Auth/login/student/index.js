import classNames from 'classnames/bind';
import styles from './style.module.scss';
import './style.scss';

function LoginStudent() {
    const cx = classNames.bind(styles);

    return (
        <>
            <div className={cx('')}>Login Student</div>
        </>
    );
}

export default LoginStudent;
