import React from "react";
import {EditingState} from '@devexpress/dx-react-grid';
import {
    Grid,
    TableHeaderRow,
    TableEditRow,
    TableEditColumn, Table,
} from '@devexpress/dx-react-grid-material-ui';
import { withStyles, Paper } from "@material-ui/core";

const styles = theme => ({
    button: {
        margin: theme.spacing()
    },
});
const getRowId = row => row.id;

const TableHeaderContentBase = ({column, children, classes, ...restProps}) => {
    return (
        <TableHeaderRow.Content
            column={column}
            {...restProps}
            className="Table_content_header"
        >
        </TableHeaderRow.Content>
    )
};

export const TableHeaderContent = withStyles(styles, {name: 'TableHeaderContent'})(TableHeaderContentBase);

export class ScheduleInformation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {name: 'id', title: 'ID'},
                {name: 'address', title: 'Địa điểm'},
                {name: 'dateOffSet', title: 'Ngày thứ'}
            ],
            tableColumnExtensions: [
                {columnName: 'id', width: 60},
            ],
            editingStateColumnExtensions: [
                {columnName: 'id', editingEnabled: false},
            ],
            rows: [],
            editingRowIds: [],
            addedRows: [],
            rowChanges: {},
        };
        this.changeAddedRows = this.changeAddedRows.bind(this);
        this.changeEditingRowIds = this.changeEditingRowIds.bind(this);
        this.changeRowChanges = this.changeRowChanges.bind(this);
        this.commitChanges = this.commitChanges.bind(this);
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.dataSource !== this.props.dataSource) {
            this.setState({rows: nextProps.dataSource});
        }
    }

    changeAddedRows(addedRows) {
        const initialized = addedRows.map(row => (Object.keys(row).length ? row : {}));
        this.setState({addedRows: initialized});
    }

    changeEditingRowIds(editingRowIds) {
        this.setState({editingRowIds});
    }

    changeRowChanges(rowChanges) {
        this.setState({rowChanges});
    }

    commitChanges({added, changed, deleted}) {
        let {rows} = this.state;
        if (added) {
            const startingAddedId = rows.length > 0 ? rows[rows.length - 1].id + 1 : 0;
            rows = [
                ...rows,
                ...added.map((row, index) => ({
                    id: startingAddedId + index,
                    ...row,
                })),
            ];
        }
        if (changed) {
            rows = rows.map(row => (changed[row.id] ? {...row, ...changed[row.id]} : row));
        }
        if (deleted) {
            const deletedSet = new Set(deleted);
            rows = rows.filter(row => !deletedSet.has(row.id));
        }
        this.props.apllySchedule(rows);
    }

    render() {
        const {
            rows, columns, tableColumnExtensions, editingRowIds, rowChanges, addedRows, editingStateColumnExtensions
        } = this.state;

        return (
            <Paper>
                <Grid
                    rows={rows}
                    columns={columns}
                    getRowId={getRowId}
                >
                    <EditingState
                        editingRowIds={editingRowIds}
                        onEditingRowIdsChange={this.changeEditingRowIds}
                        rowChanges={rowChanges}
                        onRowChangesChange={this.changeRowChanges}
                        addedRows={addedRows}
                        onAddedRowsChange={this.changeAddedRows}
                        onCommitChanges={this.commitChanges}
                        columnExtensions={editingStateColumnExtensions}
                    />
                    <Table
                        columnExtensions={tableColumnExtensions}
                    />
                    <TableHeaderRow
                        contentComponent={TableHeaderContent}
                        rowComponent={({row, style, ...restProps}) => (
                            <Table.Row
                                {...restProps}
                                // eslint-disable-next-line no-alert
                                style={{
                                    cursor: "pointer",
                                    ...style
                                }}
                                className="Table_header"
                            />
                        )}
                    />
                    <TableEditRow/>
                    <TableEditColumn
                        showAddCommand={!addedRows.length}
                        showEditCommand
                        showDeleteCommand
                    />
                </Grid>
            </Paper>
        );
    }
}