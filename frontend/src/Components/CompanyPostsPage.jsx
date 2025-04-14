import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Card, Row, Col } from "react-bootstrap";

const CompanyPostsPage = () => {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [deals, setDeals] = useState([]);
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    const fetchCompany = async () => {
      const res = await fetch(`http://localhost:3000/api/business/${companyId}`);
      const data = await res.json();
      setCompany(data);
    };

    const fetchDeals = async () => {
      const res = await fetch("http://localhost:3000/api/deals/view");
      const data = await res.json();
      const filtered = data.filter(deal =>
        String(deal.businessId?._id || deal.businessId) === String(companyId)
      );
      setDeals(filtered);
    };

    fetchCompany();
    fetchDeals();
  }, [companyId]);

  useEffect(() => {
    const fetchOpportunities = async () => {
      const res = await fetch("http://localhost:3000/api/opportunities/view");
      const data = await res.json();

      const filtered = (data.opportunities || []).filter(opp =>
        String(opp.businessId?._id || opp.businessId) === String(companyId)
      );

      setOpportunities(filtered);
    };

    fetchOpportunities();
  }, [companyId]);

  return (
    <Container className="mt-5">
      <h2>Posts by {company?.name}</h2>

      <h4 className="mt-4">Deals</h4>
      <Row>
        {deals.map((deal) => (
          <Col md={6} key={deal._id}>
            <Card className="mb-3 p-3 shadow-sm">
              <Card.Title>{deal.title}</Card.Title>
              <Card.Text>{deal.description}</Card.Text>
            </Card>
          </Col>
        ))}
        {deals.length === 0 && <p>No deals found.</p>}
      </Row>

      <h4 className="mt-4">Opportunities</h4>
      <Row>
        {opportunities.map((opp) => (
          <Col md={6} key={opp._id}>
            <Card className="mb-3 p-3 shadow-sm">
              <Card.Title>{opp.title}</Card.Title>
              <Card.Text>{opp.description}</Card.Text>
            </Card>
          </Col>
        ))}
        {opportunities.length === 0 && <p>No opportunities found.</p>}
      </Row>
    </Container>
  );
};

export default CompanyPostsPage;
