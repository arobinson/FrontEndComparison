import { useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '../hooks/useProduct';
import {
  ProgressBar,
  GradeBadge,
  NovaDots,
  ProductImage,
  TruncatedText,
  LargeCounter,
  AbsoluteDate,
  RelativeDate,
  BooleanYesNo,
  DecimalUnits,
  TimeFormat,
  StarRating,
  ColorPill,
} from '../components/display';
import './ProductDetail.css';

const ProductDetail = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { product, loading, error, adjacent } = useProduct(code ?? '');

  const navigateToList = useCallback(() => {
    navigate('/list');
  }, [navigate]);

  const navigateToPrevious = useCallback(() => {
    if (adjacent?.previousId) {
      navigate(`/detail/${adjacent.previousId}`);
    }
  }, [navigate, adjacent]);

  const navigateToNext = useCallback(() => {
    if (adjacent?.nextId) {
      navigate(`/detail/${adjacent.nextId}`);
    }
  }, [navigate, adjacent]);

  const hasPrevious = adjacent?.previousId != null;
  const hasNext = adjacent?.nextId != null;
  const positionInfo = adjacent ? `${adjacent.currentIndex} of ${adjacent.total}` : '';

  const toISOString = (value: Date | string | null | undefined): string => {
    let result: string;
    if (!value) {
      result = '';
    } else {
      const date = value instanceof Date ? value : new Date(value);
      if (isNaN(date.getTime())) {
        result = '';
      } else {
        result = date.toISOString();
      }
    }
    return result;
  };

  const createdDate = useMemo(
    () => toISOString(product?.createdDate),
    [product?.createdDate]
  );

  const lastModifiedDate = useMemo(
    () => toISOString(product?.lastUpdated),
    [product?.lastUpdated]
  );

  const releaseDate = useMemo(
    () => toISOString(product?.releaseDate),
    [product?.releaseDate]
  );

  const nextRestockDate = useMemo(
    () => toISOString(product?.nextRestockDate),
    [product?.nextRestockDate]
  );

  let content;
  if (product) {
    content = (
      <div className="product-detail">
        <div className="header-section">
          <h1>{product.productName || 'Unknown Product'}</h1>
          <div className="header-meta">
            <span className="product-code">Code: {product.code}</span>
            {product.qualityScore && <ProgressBar value={product.qualityScore} />}
          </div>
        </div>

        <div className="content-grid">
          {/* Image Gallery Section */}
          {product.imageUrl && (
            <div className="image-gallery">
              <h2>Product Images</h2>
              <div className="main-image">
                <ProductImage value={product.imageUrl} size="large" />
              </div>
            </div>
          )}

          {/* Basic Information Section */}
          <div className="info-section">
            <h2>Basic Information</h2>
            <dl className="info-list">
              <dt>Product Name</dt>
              <dd>{product.productName || 'N/A'}</dd>

              <dt>Brand</dt>
              <dd>{product.brand || 'N/A'}</dd>

              <dt>Category</dt>
              <dd>{product.category || 'N/A'}</dd>

              {product.description && (
                <>
                  <dt>Description</dt>
                  <dd>
                    <TruncatedText value={product.description} />
                  </dd>
                </>
              )}

              {product.sku && (
                <>
                  <dt>SKU</dt>
                  <dd>{product.sku}</dd>
                </>
              )}

              {product.modelNumber && (
                <>
                  <dt>Model Number</dt>
                  <dd>{product.modelNumber}</dd>
                </>
              )}

              {product.barcode && (
                <>
                  <dt>Barcode</dt>
                  <dd>{product.barcode}</dd>
                </>
              )}

              {product.color && (
                <>
                  <dt>Color</dt>
                  <dd>
                    <ColorPill value={product.color} />
                  </dd>
                </>
              )}

              {product.material && (
                <>
                  <dt>Material</dt>
                  <dd>{product.material}</dd>
                </>
              )}

              {product.size && (
                <>
                  <dt>Size</dt>
                  <dd>{product.size}</dd>
                </>
              )}

              {product.weightKg && (
                <>
                  <dt>Weight</dt>
                  <dd>
                    <DecimalUnits value={product.weightKg} unit="kg" />
                  </dd>
                </>
              )}

              {product.dimensionsCm && (
                <>
                  <dt>Dimensions</dt>
                  <dd>{product.dimensionsCm}</dd>
                </>
              )}

              <dt>Created</dt>
              <dd>
                <AbsoluteDate value={createdDate} />
              </dd>

              <dt>Last Updated</dt>
              <dd>
                <RelativeDate value={lastModifiedDate} />
              </dd>

              {releaseDate && (
                <>
                  <dt>Release Date</dt>
                  <dd>
                    <AbsoluteDate value={releaseDate} />
                  </dd>
                </>
              )}
            </dl>
          </div>

          {/* Quality & Ratings Section */}
          {(product.grade || product.safetyRating || product.customerRating || product.ecoScore) && (
            <div className="health-section">
              <h2>Quality & Ratings</h2>
              <div className="score-grid">
                {product.grade && (
                  <div className="score-item">
                    <span className="score-label">Grade</span>
                    <GradeBadge grade={product.grade} />
                  </div>
                )}

                {product.safetyRating && (
                  <div className="score-item">
                    <span className="score-label">Safety Rating</span>
                    <NovaDots rating={product.safetyRating} />
                  </div>
                )}

                {product.ecoScore && (
                  <div className="score-item">
                    <span className="score-label">Eco Score</span>
                    <ProgressBar value={product.ecoScore} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Statistics Section */}
          {(product.unitsSold || product.reviewCount) && (
            <div className="stats-section">
              <h2>Statistics</h2>
              <dl className="info-list">
                {product.unitsSold && (
                  <>
                    <dt>Units Sold</dt>
                    <dd>
                      <LargeCounter value={product.unitsSold} />
                    </dd>
                  </>
                )}

                {product.reviewCount && (
                  <>
                    <dt>Review Count</dt>
                    <dd>
                      <LargeCounter value={product.reviewCount} />
                    </dd>
                  </>
                )}

                {product.customerRating && (
                  <>
                    <dt>Customer Rating</dt>
                    <dd>
                      <StarRating value={product.customerRating} />
                    </dd>
                  </>
                )}
              </dl>
            </div>
          )}

          {/* Pricing & Financial Section */}
          {(product.price || product.cost || product.wholesalePrice) && (
            <div className="pricing-section">
              <h2>Pricing & Financial</h2>
              <dl className="info-list">
                {product.price && (
                  <>
                    <dt>Price</dt>
                    <dd>
                      <DecimalUnits value={product.price} unit={product.currencyCode || ''} />
                    </dd>
                  </>
                )}

                {product.cost && (
                  <>
                    <dt>Cost</dt>
                    <dd>
                      <DecimalUnits value={product.cost} unit={product.currencyCode || ''} />
                    </dd>
                  </>
                )}

                {product.wholesalePrice && (
                  <>
                    <dt>Wholesale Price</dt>
                    <dd>
                      <DecimalUnits value={product.wholesalePrice} unit={product.currencyCode || ''} />
                    </dd>
                  </>
                )}

                {product.taxRate !== undefined && (
                  <>
                    <dt>Tax Rate</dt>
                    <dd>
                      <DecimalUnits value={product.taxRate} unit="%" />
                    </dd>
                  </>
                )}

                {product.discountPercent !== undefined && (
                  <>
                    <dt>Discount</dt>
                    <dd>
                      <DecimalUnits value={product.discountPercent} unit="%" />
                    </dd>
                  </>
                )}
              </dl>
            </div>
          )}

          {/* Inventory Section */}
          {(product.stockQuantity !== undefined ||
            product.warehouseLocation ||
            product.reorderLevel !== undefined) && (
            <div className="inventory-section">
              <h2>Inventory</h2>
              <dl className="info-list">
                {product.stockQuantity !== undefined && (
                  <>
                    <dt>Stock Quantity</dt>
                    <dd>
                      <DecimalUnits value={product.stockQuantity} />
                    </dd>
                  </>
                )}

                {product.reorderLevel !== undefined && (
                  <>
                    <dt>Reorder Level</dt>
                    <dd>
                      <DecimalUnits value={product.reorderLevel} />
                    </dd>
                  </>
                )}

                {product.warehouseLocation && (
                  <>
                    <dt>Warehouse Location</dt>
                    <dd>{product.warehouseLocation}</dd>
                  </>
                )}

                {product.inStock !== undefined && (
                  <>
                    <dt>In Stock</dt>
                    <dd>
                      <BooleanYesNo value={product.inStock} />
                    </dd>
                  </>
                )}

                {nextRestockDate && (
                  <>
                    <dt>Next Restock</dt>
                    <dd>
                      <AbsoluteDate value={nextRestockDate} />
                    </dd>
                  </>
                )}
              </dl>
            </div>
          )}

          {/* Geographic Section */}
          {(product.originCountry || product.manufacturerCountry || product.shippingZone) && (
            <div className="geographic-section">
              <h2>Geographic Information</h2>
              <dl className="info-list">
                {product.originCountry && (
                  <>
                    <dt>Origin Country</dt>
                    <dd>{product.originCountry}</dd>
                  </>
                )}

                {product.manufacturerCountry && (
                  <>
                    <dt>Manufacturer Country</dt>
                    <dd>{product.manufacturerCountry}</dd>
                  </>
                )}

                {product.shippingZone && (
                  <>
                    <dt>Shipping Zone</dt>
                    <dd>{product.shippingZone}</dd>
                  </>
                )}

                {product.productLanguage && (
                  <>
                    <dt>Product Language</dt>
                    <dd>{product.productLanguage}</dd>
                  </>
                )}
              </dl>
            </div>
          )}

          {/* Supplier Contact Section */}
          {(product.firstName ||
            product.lastName ||
            product.supplierEmail ||
            product.supplierPhone) && (
            <div className="supplier-section">
              <h2>Supplier Contact</h2>
              <dl className="info-list">
                {(product.firstName || product.lastName) && (
                  <>
                    <dt>Contact Name</dt>
                    <dd>
                      {product.firstName} {product.lastName}
                    </dd>
                  </>
                )}

                {product.supplierEmail && (
                  <>
                    <dt>Email</dt>
                    <dd>
                      <span className="truncate-ellipsis" title={product.supplierEmail}>
                        {product.supplierEmail}
                      </span>
                    </dd>
                  </>
                )}

                {product.supplierPhone && (
                  <>
                    <dt>Phone</dt>
                    <dd>{product.supplierPhone}</dd>
                  </>
                )}

                {product.supplierTaxId && (
                  <>
                    <dt>Tax ID</dt>
                    <dd>{product.supplierTaxId}</dd>
                  </>
                )}
              </dl>
            </div>
          )}

          {/* Product Features Section */}
          {(product.isFeatured ||
            product.isBestSeller ||
            product.requiresShipping ||
            product.isDigital ||
            product.hasWarranty) && (
            <div className="features-section">
              <h2>Product Features</h2>
              <dl className="info-list">
                {product.isFeatured !== undefined && (
                  <>
                    <dt>Featured</dt>
                    <dd>
                      <BooleanYesNo value={product.isFeatured} />
                    </dd>
                  </>
                )}

                {product.isBestSeller !== undefined && (
                  <>
                    <dt>Best Seller</dt>
                    <dd>
                      <BooleanYesNo value={product.isBestSeller} />
                    </dd>
                  </>
                )}

                {product.requiresShipping !== undefined && (
                  <>
                    <dt>Requires Shipping</dt>
                    <dd>
                      <BooleanYesNo value={product.requiresShipping} />
                    </dd>
                  </>
                )}

                {product.isDigital !== undefined && (
                  <>
                    <dt>Digital Product</dt>
                    <dd>
                      <BooleanYesNo value={product.isDigital} />
                    </dd>
                  </>
                )}

                {product.hasWarranty !== undefined && (
                  <>
                    <dt>Has Warranty</dt>
                    <dd>
                      <BooleanYesNo value={product.hasWarranty} />
                    </dd>
                  </>
                )}

                {product.warrantyMonths !== undefined && (
                  <>
                    <dt>Warranty Period</dt>
                    <dd>
                      <DecimalUnits value={product.warrantyMonths} unit="months" />
                    </dd>
                  </>
                )}

                {product.certification && (
                  <>
                    <dt>Certification</dt>
                    <dd>{product.certification}</dd>
                  </>
                )}
              </dl>
            </div>
          )}

          {/* Shipping Section */}
          {(product.shippingDepartureTime || product.flightDurationHours !== undefined) && (
            <div className="shipping-section">
              <h2>Shipping Information</h2>
              <dl className="info-list">
                {product.shippingDepartureTime && (
                  <>
                    <dt>Departure Time</dt>
                    <dd>
                      <TimeFormat value={product.shippingDepartureTime} />
                    </dd>
                  </>
                )}

                {product.flightDurationHours !== undefined && (
                  <>
                    <dt>Flight Duration</dt>
                    <dd>
                      <DecimalUnits value={product.flightDurationHours} unit="hours" />
                    </dd>
                  </>
                )}
              </dl>
            </div>
          )}
        </div>
      </div>
    );
  } else if (loading) {
    content = (
      <div className="loading-state">
        <p>Loading product...</p>
      </div>
    );
  } else if (error) {
    content = (
      <div className="error-state">
        <p>Error loading product: {error}</p>
      </div>
    );
  } else {
    content = (
      <div className="not-found-state">
        <p>Product not found.</p>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <div className="navigation-bar">
        <button onClick={navigateToList} className="back-button">
          ← Back to List
        </button>
        <div className="product-navigation">
          <button
            onClick={navigateToPrevious}
            disabled={!hasPrevious}
            className="nav-button"
          >
            ← Previous
          </button>
          <span className="position-info">{positionInfo}</span>
          <button
            onClick={navigateToNext}
            disabled={!hasNext}
            className="nav-button"
          >
            Next →
          </button>
        </div>
      </div>
      <div className="detail-area">
        {loading && (
          <div className="loading-overlay">
            <span className="loading-indicator">⏳ Loading...</span>
          </div>
        )}
        {content}
      </div>
    </div>
  );
};

export default ProductDetail;
