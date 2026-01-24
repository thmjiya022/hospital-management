import { type FC } from 'react';
import { Spinner } from 'react-activity';

interface CoverProps {
    busy: boolean;
    busyMessage: string;
}

const Cover: FC<CoverProps> = ({busy, busyMessage}) => {
    if(!busy) return null;

    return <div data-cy="spinner" className='flex flex-col w-full h-full items-center justify-center'>
        <Spinner color="#727981" size={32} speed={1} animating={busy} />
        {busyMessage}
    </div>
}

interface ActivityFrameProps {
    children?: any;
    busy?: boolean;
    className?: string;
    busyMessage?: string;
    tableHeight?: string;
}

const ActivityFrame: FC<ActivityFrameProps> = ({ children, busy = false, className = 'w-full h-full', busyMessage = '', tableHeight }) => {
    return (
        <div className={`activity-frame ${className}`} style={{ maxWidth: '100%', height: `${tableHeight}` }}>
            {busy ?
                <Cover busy={busy} busyMessage={busyMessage} /> :
                <>{children}</>
            }
        </div>
    );
}

export default ActivityFrame;