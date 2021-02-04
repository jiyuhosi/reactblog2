import React from "react";
import { Row, Col } from "reactstrap";

const Header = () => {
    return (
        <div id="page-header" className="mb-3">
            <Row>
                <Col md="6" sm="auto" className="text-center m-auto">
                    <h1>Practice makes perfect </h1>
                    <p>星君のプロジェクトの作業ブログです</p>
                </Col>
            </Row>
        </div>
    );
};

export default Header;
