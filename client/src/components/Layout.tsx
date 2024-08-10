import React, { FC } from 'react';
import Toolbar from './Toolbar';
import SettingBar from './SettingBar';
import Canvas from './Canvas';

const Layout: FC = () => {

    return (
        <div>
            <Toolbar/>
            <SettingBar/>
            <Canvas/>
        </div>
    );
};

export default Layout;