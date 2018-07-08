import * as React from 'react';

interface ILoaderPROPS {
    show: boolean
    percent: string
}

class Loader extends React.Component<ILoaderPROPS,{}> {

    constructor(props: ILoaderPROPS){
        super(props);

    }

    public render() {
        if (this.props.show){
            return (
                <div className={'Loader'}>Loading Image... {this.props.percent}</div>
                )
            }

        return <div/>
    }
}

export default Loader;