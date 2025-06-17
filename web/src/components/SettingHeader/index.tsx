import React from "react";
import styles from './style.module.scss';
function SettingHeader(props: React.PropsWithChildren<{ title: string; description: string; }>) {
    const { title, description, children } = props;
    return (
        <div className={styles.container}>
            <div>
                <h1 className="title is-2">{title}</h1>
                <p style={{ marginTop: '0.5rem', color: '#64748b' }}>
                    {description}
                </p>
            </div>
            <div>
                {children}
            </div>
        </div>
    )
}

export default React.memo(SettingHeader)