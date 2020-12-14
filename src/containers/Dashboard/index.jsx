import React, {Component} from 'react'
import ChartDriver from './ChartDriver';
import ChartReport from './ChartReport';

class Dashboard extends Component {
    render() {
        return (
            <div>
                <ChartReport/>
                <ChartDriver/>
            </div>
        );
    }
}

export default Dashboard;