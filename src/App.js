import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import esServerApi  from './esServerApi';
import * as resolve from 'table-resolver';
import { bindMethods } from 'patternfly-react';
import {
  actionHeaderCellFormatter,
  customHeaderFormattersDefinition,
  selectionCellFormatter,
  selectionHeaderCellFormatter,
  sortableHeaderCellFormatter,
  tableCellFormatter,
  Table,
  TABLE_SORT_DIRECTION,
  Button,
  DropdownKebab,
  Filter,
  FormControl,
  Icon,
  MenuItem,
  Sort,
  Toolbar
} from 'patternfly-react';
import { Paginator, PAGINATION_VIEW } from 'patternfly-react';
import logo from './logo.svg';
import './css/patternfly.min.css';
import './css/patternfly-additions.min.css';
import './App.css';

class App extends Component {

  static onRow(row, { rowIndex }) {
    return {
      className: cx({ selected: row.selected }),
      role: 'row'
    };
  }
  constructor(props) {
    super(props);

    // enables our custom header formatters extensions to reactabular
    this.customHeaderFormatters = customHeaderFormattersDefinition;

    bindMethods(this, [
      'customHeaderFormatters',
      'onPerPageSelect',
      'onPageSet',
      'onSort'
    ]);

    this.state = {
      // Sort the first column in an ascending way by default.
      sortingColumns: {
        account_number: {
          direction: TABLE_SORT_DIRECTION.ASC,
          position: 0
        },
      },

      // column definitions
      columns: [
        {
          property: 'select',
          header: {
            label: 'Select all rows',
            props: {
              index: 0,
              rowSpan: 1,
              colSpan: 1
            },
            customFormatters: [selectionHeaderCellFormatter]
          },
          cell: {
            props: {
              index: 0
            },
            formatters: [
              (value, { rowData, rowIndex }) => {
                return selectionCellFormatter(
                  { rowData, rowIndex },
                  this.onSelectRow
                );
              }
            ]
          }
        },
        {
          property: 'account_number',
          header: {
            label: 'Account Name',
            props: {
              index: 1,
              rowSpan: 1,
              colSpan: 1
            },
            customFormatters: [sortableHeaderCellFormatter]
          },
          cell: {
            props: {
              index: 1
            },
            formatters: [tableCellFormatter]
          }
        },
        {
          property: 'balance',
          header: {
            label: 'Balance',
            props: {
              index: 2,
              rowSpan: 1,
              colSpan: 1
            },
            customFormatters: [sortableHeaderCellFormatter]
          },
          cell: {
            props: {
              index: 2
            },
            formatters: [tableCellFormatter]
          }
        },
        {
          property: 'firstname',
          header: {
            label: 'First Name',
            props: {
              index: 3,
              rowSpan: 1,
              colSpan: 1
            },
            customFormatters: [sortableHeaderCellFormatter]
          },
          cell: {
            props: {
              index: 3
            },
            formatters: [tableCellFormatter]
          }
        },
        {
          property: 'lastname',
          header: {
            label: 'Last Name',
            props: {
              index: 4,
              rowSpan: 1,
              colSpan: 1
            },
            customFormatters: [sortableHeaderCellFormatter]
          },
          cell: {
            props: {
              index: 4
            },
            formatters: [tableCellFormatter]
          }
        },
        {
          property: 'age',
          header: {
            label: 'Age',
            props: {
              index: 5,
              rowSpan: 1,
              colSpan: 1
            },
            customFormatters: [sortableHeaderCellFormatter]
          },
          cell: {
            props: {
              index: 5
            },
            formatters: [tableCellFormatter]
          }
        },
        {
          property: 'gender',
          header: {
            label: 'Gender',
            props: {
              index: 6,
              rowSpan: 1,
              colSpan: 1
            },
            customFormatters: [sortableHeaderCellFormatter]
          },
          cell: {
            props: {
              index: 6
            },
            formatters: [tableCellFormatter]
          }
        },
        {
          property: 'address',
          header: {
            label: 'Address',
            props: {
              index: 7,
              rowSpan: 1,
              colSpan: 1
            },
            customFormatters: [sortableHeaderCellFormatter]
          },
          cell: {
            props: {
              index: 7
            },
            formatters: [tableCellFormatter]
          }
        },
        {
          property: 'employer',
          header: {
            label: 'Employer',
            props: {
              index: 8,
              rowSpan: 1,
              colSpan: 1
            },
            customFormatters: [sortableHeaderCellFormatter]
          },
          cell: {
            props: {
              index: 8
            },
            formatters: [tableCellFormatter]
          }
        },
        {
          property: 'email',
          header: {
            label: 'Email',
            props: {
              index: 9,
              rowSpan: 1,
              colSpan: 1
            },
            customFormatters: [sortableHeaderCellFormatter]
          },
          cell: {
            props: {
              index: 9
            },
            formatters: [tableCellFormatter]
          }
        },
        {
          property: 'city',
          header: {
            label: 'City',
            props: {
              index: 9,
              rowSpan: 1,
              colSpan: 1
            },
            customFormatters: [sortableHeaderCellFormatter]
          },
          cell: {
            props: {
              index: 9
            },
            formatters: [tableCellFormatter]
          }
        },
        {
          property: 'state',
          header: {
            label: 'State',
            props: {
              index: 10,
              rowSpan: 1,
              colSpan: 1
            },
            customFormatters: [sortableHeaderCellFormatter]
          },
          cell: {
            props: {
              index: 10
            },
            formatters: [tableCellFormatter]
          }
        }
      ],

      // rows and row selection state
      rows: [],

      // pagination default states
      pagination: {
        page: 1,
        perPage: 10,
        perPageOptions: [10, 15, 25, 50, 100, 200]
      },

      // server side pagination values
      itemCount: 0
    };
  }

  componentWillMount() {
    const { sortingColumns, pagination } = this.state;
    this.getPage(sortingColumns, pagination);
  }

  getPage(sortingColumns, pagination) {
    const { onServerPageLogger } = this.props;

    // call our mock server with next sorting/paging arguments
    const getPageArgs = {
      sortingColumns,
      page: pagination.page,
      perPage: pagination.perPage
    };

    //onServerPageLogger(getPageArgs);

    new esServerApi().getPage(getPageArgs).then(response => {
      this.setState({
        sortingColumns: sortingColumns,
        pagination: pagination,
        rows: response.rows,
        itemCount: response.total
      });
    });

    
  }

  onSort(e, column, sortDirection) {
    // Clearing existing sortingColumns does simple single column sort. To do multisort,
    // set each column based on existing sorts specified and set sort position.
    const updatedSortingColumns = {
      [column.property]: {
        direction:
          sortDirection === TABLE_SORT_DIRECTION.ASC
            ? TABLE_SORT_DIRECTION.DESC
            : TABLE_SORT_DIRECTION.ASC,
        position: 0
      }
    };

    this.getPage(updatedSortingColumns, this.state.pagination);
  }

  onPerPageSelect(eventKey, e) {
    let newPaginationState = Object.assign({}, this.state.pagination);
    newPaginationState.perPage = eventKey;
    newPaginationState.page = 1;
    this.getPage(this.state.sortingColumns, newPaginationState);
  }
  onPageSet(page) {
    let newPaginationState = Object.assign({}, this.state.pagination);
    newPaginationState.page = page;
    this.getPage(this.state.sortingColumns, newPaginationState);
  }

  render() {
    const { columns, pagination, sortingColumns, rows, itemCount } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
         
        </p>
        <div className="container">
        

        <Table.PfProvider
          striped
          bordered
          hover
          dataTable
          columns={columns}
          components={{
            header: {
              cell: cellProps => {
                return this.customHeaderFormatters({
                  cellProps,
                  columns,
                  sortingColumns,
                  rows: rows,
                  onSelectAllRows: this.onSelectAllRows,
                  onSort: this.onSort
                });
              }
            }
          }}
        >
          <Table.Header headerRows={resolve.headerRows({ columns })} />
          <Table.Body rows={rows} rowKey="id" onRow={App.onRow} />
        </Table.PfProvider>
        <Paginator
          viewType={PAGINATION_VIEW.TABLE}
          pagination={pagination}
          itemCount={itemCount}
          onPageSet={this.onPageSet}
          onPerPageSelect={this.onPerPageSelect}
        />
        </div>
      </div>

      
    );
  }
}

export default App;
