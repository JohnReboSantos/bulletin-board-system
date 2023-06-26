import React, { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/RootStore';
import { useGetBoardName } from './utils';
import { Card, ListGroup, Pagination, Navbar, Button } from 'react-bootstrap';

const BoardPage: React.FC<{
  board: {
    id: number;
    name: string;
    topic: string;
    description: string;
    created_at: string;
  };
}> = ({ board }) => {
  const rootStore = useStore();
  const getBoardName = useGetBoardName();

  const memoizedThreads = useMemo(
    () => rootStore.threads.threads,
    [rootStore.threads.threads],
  );

  const renderThreads = useCallback(() => {
    console.log('memoizedThreads:', memoizedThreads);
    const filteredThreads = memoizedThreads.filter(
      (thread) => getBoardName(parseInt(thread.board)) === board.name,
    );
    console.log('filteredThreads:', filteredThreads);
    return filteredThreads.map((thread) => (
      <ListGroup.Item key={thread.id}>
        <div className="d-flex justify-content-between align-items-center">
          <Link to={`/board_${board.name}/thread_${thread.title}`}>
            <div>{thread.title}</div>
          </Link>
          <div>
            {thread.locked && <span className="text-danger">Locked</span>}
          </div>
        </div>
        <div className="mt-2">
          <small>
            Last reply: {/* last reply */} by {/* last replier name*/}
          </small>
        </div>
      </ListGroup.Item>
    ));
  }, [board.name, getBoardName, memoizedThreads]);

  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="/">Bulletin Board System</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Navbar.Collapse className="justify-content-end">
            <Button variant="primary">Log in</Button>
            <Button variant="primary">Register</Button>
          </Navbar.Collapse>
        </Navbar.Collapse>
      </Navbar>
      <div className="board-index-page">
        <h2>{board.name}</h2>
        <Card>
          <ListGroup variant="flush">{renderThreads()}</ListGroup>
        </Card>
        <Pagination className="mt-3">
          <Pagination.First />
          <Pagination.Prev />
          <Pagination.Item active>{1}</Pagination.Item>
          <Pagination.Item>{2}</Pagination.Item>
          <Pagination.Item>{3}</Pagination.Item>
          <Pagination.Ellipsis />
          <Pagination.Next />
          <Pagination.Last />
        </Pagination>
      </div>
    </div>
  );
};

export default observer(BoardPage);
