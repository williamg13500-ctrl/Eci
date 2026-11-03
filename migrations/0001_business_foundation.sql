CREATE TABLE product_categories (id BIGSERIAL PRIMARY KEY, name TEXT NOT NULL UNIQUE, slug TEXT NOT NULL UNIQUE, sort_order INTEGER NOT NULL DEFAULT 0, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now());

CREATE TABLE products (id BIGSERIAL PRIMARY KEY, product_ref TEXT NOT NULL UNIQUE, name TEXT NOT NULL, category_id BIGINT NOT NULL REFERENCES product_categories(id), description TEXT, price_amount NUMERIC(12,2), price_currency CHAR(3), main_image_url TEXT NOT NULL, image_alt TEXT NOT NULL, availability_status TEXT CHECK (availability_status IS NULL OR availability_status IN ('available','reserved','sold','unavailable')), is_featured BOOLEAN NOT NULL DEFAULT false, is_archived BOOLEAN NOT NULL DEFAULT false, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now(), CONSTRAINT products_price_pair CHECK ((price_amount IS NULL AND price_currency IS NULL) OR (price_amount IS NOT NULL AND price_currency IS NOT NULL)), CONSTRAINT products_price_nonnegative CHECK (price_amount IS NULL OR price_amount >= 0));

CREATE INDEX products_category_idx ON products(category_id);

CREATE INDEX products_availability_idx ON products(availability_status) WHERE is_archived = false;

CREATE INDEX products_featured_idx ON products(is_featured) WHERE is_archived = false;

CREATE TABLE product_gallery_images (id BIGSERIAL PRIMARY KEY, product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE, image_url TEXT NOT NULL, alt_text TEXT NOT NULL DEFAULT '', sort_order INTEGER NOT NULL DEFAULT 0, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), UNIQUE(product_id, image_url));

CREATE INDEX product_gallery_product_idx ON product_gallery_images(product_id, sort_order);

CREATE TABLE artworks (id BIGSERIAL PRIMARY KEY, artwork_ref TEXT NOT NULL UNIQUE, name TEXT NOT NULL, description TEXT, image_url TEXT NOT NULL, image_alt TEXT NOT NULL, availability_status TEXT CHECK (availability_status IS NULL OR availability_status IN ('available','reserved','sold','unavailable')), is_featured BOOLEAN NOT NULL DEFAULT false, is_archived BOOLEAN NOT NULL DEFAULT false, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now());

CREATE TABLE enquiries (id BIGSERIAL PRIMARY KEY, enquiry_ref TEXT NOT NULL UNIQUE, customer_name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT, enquiry_type TEXT NOT NULL CHECK (enquiry_type IN ('product','commission','artwork','general')), product_id BIGINT REFERENCES products(id) ON DELETE SET NULL, product_ref_snapshot TEXT, message TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','in_progress','responded','closed','spam')), admin_notes TEXT, submission_token TEXT UNIQUE, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now());

CREATE INDEX enquiries_status_created_idx ON enquiries(status, created_at DESC);

CREATE INDEX enquiries_email_idx ON enquiries(email);

CREATE TABLE activity_history (id BIGSERIAL PRIMARY KEY, actor_id TEXT, actor_label TEXT, action TEXT NOT NULL, entity_type TEXT NOT NULL, entity_id BIGINT, entity_ref TEXT, details JSONB NOT NULL DEFAULT '{}'::jsonb, created_at TIMESTAMPTZ NOT NULL DEFAULT now());

CREATE INDEX activity_history_created_idx ON activity_history(created_at DESC);

INSERT INTO product_categories (name, slug, sort_order) VALUES ('Tees','tees',1);

INSERT INTO product_categories (name, slug, sort_order) VALUES ('Denim','denim',2);

INSERT INTO product_categories (name, slug, sort_order) VALUES ('Outerwear','outerwear',3);

INSERT INTO product_categories (name, slug, sort_order) VALUES ('Footwear','footwear',4);

INSERT INTO product_categories (name, slug, sort_order) VALUES ('Bags','bags',5);

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-001','Raspberry Panther: Fanged Archive',id,'Screen intervention on washed black cotton','https://asset-huggers.lovable.app/__l5e/assets-v1/e1e0e70a-e45f-4def-8402-ef135b57be54/eci-01.webp','Raspberry Panther: Fanged Archive' FROM product_categories WHERE name='Tees';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-002','Now Always Comes',id,'Collage transfer, hand-sanded edges','https://asset-huggers.lovable.app/__l5e/assets-v1/aed58efd-7404-40ee-b3c2-2b4127397b36/eci-02.webp','Now Always Comes' FROM product_categories WHERE name='Tees';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-003','Enfants Rich: Quartet Panel',id,'Four-panel photo grain, ink annotations','https://asset-huggers.lovable.app/__l5e/assets-v1/1c3c5f43-9b96-4f9f-9717-2d1ba1aa7c8e/eci-03.webp','Enfants Rich: Quartet Panel' FROM product_categories WHERE name='Tees';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-004','Valley Dreams: Swan Requiem',id,'Oxblood dye bath, chain-stitch script','https://asset-huggers.lovable.app/__l5e/assets-v1/4b66414a-46ce-471b-afbc-a592ffa8c9b3/eci-04.webp','Valley Dreams: Swan Requiem' FROM product_categories WHERE name='Tees';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-005','Crucifix Voltage',id,'Bleach ground with gilded lightning','https://asset-huggers.lovable.app/__l5e/assets-v1/47e0ed5e-4f1e-4681-b0dc-f4b9ac7e9611/eci-05.webp','Crucifix Voltage' FROM product_categories WHERE name='Tees';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-006','Crucifix Voltage II',id,'Second state, lighter wash','https://asset-huggers.lovable.app/__l5e/assets-v1/efb0e072-7cfe-4a45-ac42-0515f7223c3c/eci-06.webp','Crucifix Voltage II' FROM product_categories WHERE name='Tees';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-007','Rasphills: Cyrillic Orbit',id,'Bone cotton, orbital plot print','https://asset-huggers.lovable.app/__l5e/assets-v1/735e175c-4bf0-4ba2-9b77-f1ed760cf18b/eci-07.webp','Rasphills: Cyrillic Orbit' FROM product_categories WHERE name='Tees';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-008','Saint Skulls: Cathedral Knit',id,'Acid-clouded heavyweight crew','https://asset-huggers.lovable.app/__l5e/assets-v1/fdb3d15b-6236-4249-8fc1-ac6b805b8a79/eci-08.webp','Saint Skulls: Cathedral Knit' FROM product_categories WHERE name='Outerwear';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-009','Palm Sermon: Layered Raglan',id,'Double-layer raglan, sketch sermon','https://asset-huggers.lovable.app/__l5e/assets-v1/e88f34d7-372f-47a9-98d9-bc898653c2c4/eci-09.webp','Palm Sermon: Layered Raglan' FROM product_categories WHERE name='Outerwear';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-010','Thorn Field: Blackout Crew',id,'Tonal thorn burnout on black','https://asset-huggers.lovable.app/__l5e/assets-v1/dbb2c573-c393-43da-9df3-5cba309e9da4/eci-10.webp','Thorn Field: Blackout Crew' FROM product_categories WHERE name='Outerwear';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-011','Attracted By Style: Hood Panel',id,'Panelled hood, archive graphic','https://asset-huggers.lovable.app/__l5e/assets-v1/7e4f8066-b0dd-4f49-a9ae-1f578edbf362/eci-11.webp','Attracted By Style: Hood Panel' FROM product_categories WHERE name='Outerwear';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-012','Crackpot: Chain Grin',id,'Oversized box fit, magenta ink','https://asset-huggers.lovable.app/__l5e/assets-v1/17dd4097-f1d9-48e3-93c8-7f01580cde4b/eci-12.webp','Crackpot: Chain Grin' FROM product_categories WHERE name='Tees';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-013','Crackpot: Ghost Pair',id,'Front / back study, single run','https://asset-huggers.lovable.app/__l5e/assets-v1/64a05641-8c70-47ad-b6b6-040e93f4ff51/eci-13.webp','Crackpot: Ghost Pair' FROM product_categories WHERE name='Tees';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-014','Overkill: Bone Chorus',id,'Bone ground, skeletal chorus line','https://asset-huggers.lovable.app/__l5e/assets-v1/66b46d48-84c3-4414-a07c-bed83f234668/eci-14.webp','Overkill: Bone Chorus' FROM product_categories WHERE name='Tees';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-015','Just Kiss Me: Newsprint Riot',id,'Full-bleed newsprint collage','https://asset-huggers.lovable.app/__l5e/assets-v1/0665c460-3204-40f2-87e5-b4c930929e80/eci-15.webp','Just Kiss Me: Newsprint Riot' FROM product_categories WHERE name='Tees';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-016','Valley of Shadow: Rust Hoodie',id,'Rust overdye, psalm text body','https://asset-huggers.lovable.app/__l5e/assets-v1/82944381-5853-48c6-97f7-dbc335d094e7/eci-16.webp','Valley of Shadow: Rust Hoodie' FROM product_categories WHERE name='Outerwear';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-017','Some Like It Violent',id,'Bleeding type, single-colour pull','https://asset-huggers.lovable.app/__l5e/assets-v1/e4d02027-6b7e-4c7a-9120-07403cb4b8d1/eci-17.webp','Some Like It Violent' FROM product_categories WHERE name='Tees';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-018','Ghost: Distressed Ivory',id,'Hand-shredded, ink splatter','https://asset-huggers.lovable.app/__l5e/assets-v1/5e6afcf5-9d76-4323-affe-15b22cf4ff52/eci-18.webp','Ghost: Distressed Ivory' FROM product_categories WHERE name='Tees';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-019','Nothing Is Permanent',id,'Halftone transfer, raw hem','https://asset-huggers.lovable.app/__l5e/assets-v1/012b0886-7d6c-4982-aa44-60bfe4eb8aac/eci-19.webp','Nothing Is Permanent' FROM product_categories WHERE name='Tees';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-020','Ribcage: Red Thread',id,'Anatomical print, red thread repair','https://asset-huggers.lovable.app/__l5e/assets-v1/adfa3167-72ee-4fc4-85b8-45b39638f1c8/eci-20.webp','Ribcage: Red Thread' FROM product_categories WHERE name='Tees';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-021','Float Like A Butterfly',id,'Grommet hem, brush lettering','https://asset-huggers.lovable.app/__l5e/assets-v1/0f64defa-e787-474b-a2cd-2830edde9c54/eci-21.webp','Float Like A Butterfly' FROM product_categories WHERE name='Tees';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-022','Orange Static: Burned Tee',id,'Burn-treated ground, static wash','https://asset-huggers.lovable.app/__l5e/assets-v1/c53341c9-dae2-46ec-a1fe-b1cece8d4006/eci-22.webp','Orange Static: Burned Tee' FROM product_categories WHERE name='Tees';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-023','Redacted Word: Shredded Tee',id,'Redaction panel, distressed body','https://asset-huggers.lovable.app/__l5e/assets-v1/110ccb0a-22c7-4da0-a698-568dbcae3af9/eci-23.webp','Redacted Word: Shredded Tee' FROM product_categories WHERE name='Tees';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-024','Demon Vine: Crimson Split Denim',id,'Split-panel flare, crimson gusset','https://asset-huggers.lovable.app/__l5e/assets-v1/1bd43181-6bb9-4246-8d6b-50c3b8675ea8/eci-24.webp','Demon Vine: Crimson Split Denim' FROM product_categories WHERE name='Denim';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-025','Patch Archive: Solar Badges',id,'Salvaged badges on light wash','https://asset-huggers.lovable.app/__l5e/assets-v1/8d2c2e68-9ba6-4d6f-a9d4-abf0458b26ca/eci-25.webp','Patch Archive: Solar Badges' FROM product_categories WHERE name='Denim';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-026','Bleach Ghost: Grid Stitch',id,'Grid topstitch across bleach field','https://asset-huggers.lovable.app/__l5e/assets-v1/8b925443-d922-4d92-9f57-7252bcc16a7f/eci-26.webp','Bleach Ghost: Grid Stitch' FROM product_categories WHERE name='Denim';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-027','Blood Rose Panel Denim',id,'Floral offcuts, raw panel seams','https://asset-huggers.lovable.app/__l5e/assets-v1/45817faa-9d91-4813-9d3f-1ef4292c443d/eci-27.webp','Blood Rose Panel Denim' FROM product_categories WHERE name='Denim';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-028','Star Fall: Constellation Denim',id,'Cut-in stars, flared leg','https://asset-huggers.lovable.app/__l5e/assets-v1/d394478b-6d59-4f96-924b-df2c18016faf/eci-28.webp','Star Fall: Constellation Denim' FROM product_categories WHERE name='Denim';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-029','Olive Star Cascade',id,'Olive star run, destroyed knee','https://asset-huggers.lovable.app/__l5e/assets-v1/0fafd260-2c3f-40dd-ace8-c4d1a61c79bc/eci-29.webp','Olive Star Cascade' FROM product_categories WHERE name='Denim';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-030','Bleach Saint: Painted Crew',id,'Bleach-painted by hand, one of one','https://asset-huggers.lovable.app/__l5e/assets-v1/958f3973-d76d-4ddc-bab4-09c21eab623a/eci-30.webp','Bleach Saint: Painted Crew' FROM product_categories WHERE name='Tees';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-031','Bleach Wraith: Painted Crew',id,'Bleach-painted by hand, one of one','https://asset-huggers.lovable.app/__l5e/assets-v1/858dbe35-d107-41e8-8888-9a147cd743cd/eci-31.webp','Bleach Wraith: Painted Crew' FROM product_categories WHERE name='Tees';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-032','Combat Study: Illustrated Denim',id,'Full-leg illustration, painted panels','https://asset-huggers.lovable.app/__l5e/assets-v1/ecbf4b63-6e76-47cc-a4c5-95604aea82bc/eci-32.webp','Combat Study: Illustrated Denim' FROM product_categories WHERE name='Denim';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-033','Spatial Dialogue: Jacket & Jean Set',id,'Two-piece painted set','https://asset-huggers.lovable.app/__l5e/assets-v1/1e240f22-6a24-4476-afd0-2966cfb70e4a/eci-33.webp','Spatial Dialogue: Jacket & Jean Set' FROM product_categories WHERE name='Denim';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-034','Nocturnal Forest: Airbrush Denim',id,'Airbrush gradient, forest horizon','https://asset-huggers.lovable.app/__l5e/assets-v1/0012ba82-76e4-428f-96a0-839740d5e287/eci-34.webp','Nocturnal Forest: Airbrush Denim' FROM product_categories WHERE name='Denim';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-035','Trauma Sigils: Handpainted Denim',id,'White ink sigils on indigo','https://asset-huggers.lovable.app/__l5e/assets-v1/9defc2dd-043d-4d7a-9614-bb1566dc224c/eci-35.webp','Trauma Sigils: Handpainted Denim' FROM product_categories WHERE name='Denim';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-036','Art Scrap: Raw Patch Study',id,'Studio floor study, raw scraps','https://asset-huggers.lovable.app/__l5e/assets-v1/34a48f2f-ada8-4ce2-9d1c-b4f90468bdb2/eci-36.webp','Art Scrap: Raw Patch Study' FROM product_categories WHERE name='Denim';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-037','Saint Tears: The Savior Knit',id,'Distressed knit, cathedral graphic','https://asset-huggers.lovable.app/__l5e/assets-v1/7c37c636-9db9-4bf7-8e60-9361ae24bb9e/eci-37.webp','Saint Tears: The Savior Knit' FROM product_categories WHERE name='Outerwear';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-038','Passion Portrait: Clay Hoodie',id,'Clay overdye, portrait burnout','https://asset-huggers.lovable.app/__l5e/assets-v1/d043b9c8-9ebc-4abb-8e8a-385320395222/eci-38.webp','Passion Portrait: Clay Hoodie' FROM product_categories WHERE name='Outerwear';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-039','Graffiti Field: Wide-Leg Denim',id,'Hand-marked light wash, layered red and black script','https://asset-huggers.lovable.app/__l5e/assets-v1/c9ff69b2-f822-40ee-90b8-1b507bbc7d41/IMG_3897.webp','Graffiti Field: Wide-Leg Denim' FROM product_categories WHERE name='Denim';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-040','Raw Signal: Silver Denim',id,'Wide-leg silver wash with hand-drawn symbols','https://asset-huggers.lovable.app/__l5e/assets-v1/cef457db-216c-4309-8421-4915eb88a016/IMG_3898.webp','Raw Signal: Silver Denim' FROM product_categories WHERE name='Denim';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-041','City Script: Painted Denim',id,'Multicolour street-script intervention on faded denim','https://asset-huggers.lovable.app/__l5e/assets-v1/869a43a7-6de9-43d0-a0ca-f4f54d26ddae/IMG_3899.webp','City Script: Painted Denim' FROM product_categories WHERE name='Denim';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-042','Never Break: Rose Jacket',id,'Oversized denim jacket with hand-painted rose back panel','https://asset-huggers.lovable.app/__l5e/assets-v1/c69ce2a3-9186-477b-a09f-58226f107894/IMG_3904.webp','Never Break: Rose Jacket' FROM product_categories WHERE name='Outerwear';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-043','Rebel Power: Skull Jacket',id,'Studded denim with painted skull and reconstructed details','https://asset-huggers.lovable.app/__l5e/assets-v1/4830450d-23e9-49ec-b926-8c98c61c70c9/IMG_3906.webp','Rebel Power: Skull Jacket' FROM product_categories WHERE name='Outerwear';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-044','Shinobi Archive Jacket',id,'Illustrated manga panels on a reconstructed denim body','https://asset-huggers.lovable.app/__l5e/assets-v1/36b6134c-b9f3-412c-a58f-d1571c35f8f2/IMG_3907.webp','Shinobi Archive Jacket' FROM product_categories WHERE name='Outerwear';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-045','Portrait Study: Denim Jacket',id,'Monochrome painted portrait across a vintage denim back','https://asset-huggers.lovable.app/__l5e/assets-v1/a62f4e44-ba4e-43c1-84fc-b38436081f99/IMG_3908.webp','Portrait Study: Denim Jacket' FROM product_categories WHERE name='Outerwear';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-046','Old Masters: Fresco Denim',id,'Renaissance print transfer across wide legs','https://asset-huggers.lovable.app/__l5e/assets-v1/b24317a5-2bc3-406c-8b0e-b1ccb6ba8554/new-01.webp','Old Masters: Fresco Denim' FROM product_categories WHERE name='Denim';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-047','No Dreams Just Goals: Cosmonaut Jacket',id,'Spray-painted astronaut on black denim','https://asset-huggers.lovable.app/__l5e/assets-v1/6802eccd-a2da-49a5-8891-2747807993bc/new-02.webp','No Dreams Just Goals: Cosmonaut Jacket' FROM product_categories WHERE name='Outerwear';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-048','Chaos 13: Stay Weird Shorts',id,'Hand-painted icons on cut-off denim','https://asset-huggers.lovable.app/__l5e/assets-v1/fda5402c-9239-4cb8-b860-1cd6fd7854d0/new-03.webp','Chaos 13: Stay Weird Shorts' FROM product_categories WHERE name='Denim';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-049','Stay Strange: Biker Leather',id,'Airbrushed cartoon duo on black leather','https://asset-huggers.lovable.app/__l5e/assets-v1/b73b35cf-d14f-4639-9133-2629020ca57e/new-04.webp','Stay Strange: Biker Leather' FROM product_categories WHERE name='Outerwear';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-050','Make More Mistakes: Floating Denim',id,'Script and figure on pale wash','https://asset-huggers.lovable.app/__l5e/assets-v1/5f88dc80-f551-47ff-aa76-ba8b021f714f/new-05.webp','Make More Mistakes: Floating Denim' FROM product_categories WHERE name='Denim';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-051','No Rules: Neon Riot Jacket',id,'Airbrushed skulls and sigils on light denim','https://asset-huggers.lovable.app/__l5e/assets-v1/62502304-30e0-485c-aa15-9654a76e2460/new-06.webp','No Rules: Neon Riot Jacket' FROM product_categories WHERE name='Outerwear';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-052','Saint Love Me: Cut-Off Shorts',id,'Crosses and dripping heart, raw hems','https://asset-huggers.lovable.app/__l5e/assets-v1/4e27a74a-4dce-467f-8478-053b3ac4ad8c/new-07.webp','Saint Love Me: Cut-Off Shorts' FROM product_categories WHERE name='Denim';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-053','Horned Ledger: Sketch Denim',id,'Black-ink doodle armour on white wash','https://asset-huggers.lovable.app/__l5e/assets-v1/faf8edc3-832a-4cb0-8322-62bd8701ee0a/new-08.webp','Horned Ledger: Sketch Denim' FROM product_categories WHERE name='Denim';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-054','Holy Flame: Blue Spirit Denim',id,'Painted dove and blue tribal fire','https://asset-huggers.lovable.app/__l5e/assets-v1/0cfe7846-f84e-4263-a58f-6c63bdae343d/new-09.webp','Holy Flame: Blue Spirit Denim' FROM product_categories WHERE name='Denim';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-055','Crimson Ghost: Anime Denim',id,'Hand-painted figure on vintage wash','https://asset-huggers.lovable.app/__l5e/assets-v1/f09ba04f-812e-43c3-9672-e3107b845731/new-10.webp','Crimson Ghost: Anime Denim' FROM product_categories WHERE name='Denim';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-056','Chaos Keos: Studded Jacket',id,'Skull, studs and anarchy patches','https://asset-huggers.lovable.app/__l5e/assets-v1/717cfbeb-dae1-4292-9970-260a64942152/new-11.webp','Chaos Keos: Studded Jacket' FROM product_categories WHERE name='Outerwear';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-057','Proud Señor: Celebration Set',id,'Painted portraits with pink flame hem','https://asset-huggers.lovable.app/__l5e/assets-v1/718b745a-1344-4cb6-9b34-b5eb9b7cb751/new-12.webp','Proud Señor: Celebration Set' FROM product_categories WHERE name='Denim';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-058','Work Of Art: Crimson Collage Jacket',id,'Collage portrait on red cotton','https://asset-huggers.lovable.app/__l5e/assets-v1/0eab7e3e-afde-4faf-8c49-1f9b644865d9/new-13.webp','Work Of Art: Crimson Collage Jacket' FROM product_categories WHERE name='Outerwear';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-059','Saint Halo: Cropped Leather',id,'Painted portrait on cropped leather','https://asset-huggers.lovable.app/__l5e/assets-v1/ec388cd0-c627-48b4-b5d4-51b54f6c13f1/new-14.webp','Saint Halo: Cropped Leather' FROM product_categories WHERE name='Outerwear';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-060','Ice Tribal: Night Denim',id,'Electric-blue tribal flames on raw indigo','https://asset-huggers.lovable.app/__l5e/assets-v1/5d886c1d-86ae-4f3d-93a2-7ae7f28ac0a8/new-15.webp','Ice Tribal: Night Denim' FROM product_categories WHERE name='Denim';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-061','Skull Romantics: Fire Denim',id,'Flames, hearts and skull lettering','https://asset-huggers.lovable.app/__l5e/assets-v1/06e748cb-00b5-402d-840f-184cfadc9c71/new-16.webp','Skull Romantics: Fire Denim' FROM product_categories WHERE name='Denim';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-062','Ruined Diary: Tagged Denim',id,'Scrawled notes on destroyed wash','https://asset-huggers.lovable.app/__l5e/assets-v1/80fe7d40-3c7d-4015-a9f5-e3469d5a4900/new-17.webp','Ruined Diary: Tagged Denim' FROM product_categories WHERE name='Denim';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-063','Brand Dept: Skeleton Riff Jacket',id,'Full-back painted skeleton guitarist','https://asset-huggers.lovable.app/__l5e/assets-v1/9655c5dd-048b-4e1b-9d76-24a6cf7bd97e/new-18.webp','Brand Dept: Skeleton Riff Jacket' FROM product_categories WHERE name='Outerwear';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-064','Sakura Drift: Blossom Denim',id,'Hand-painted cherry blossom on light wash','https://asset-huggers.lovable.app/__l5e/assets-v1/7f519b88-652a-4b23-b79f-9b00b9591795/new-19.webp','Sakura Drift: Blossom Denim' FROM product_categories WHERE name='Denim';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-065','Custom Kicks No. 01',id,'Hand-painted custom footwear, one of one','https://asset-huggers.lovable.app/__l5e/assets-v1/3faa626f-3e37-43c8-8d04-583b4ba973f1/foot-01.webp','Custom Kicks No. 01' FROM product_categories WHERE name='Footwear';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-066','Custom Kicks No. 02',id,'Hand-painted custom footwear, one of one','https://asset-huggers.lovable.app/__l5e/assets-v1/53e4c773-f8f3-4fd4-96d7-b786c85b9c2a/foot-02.webp','Custom Kicks No. 02' FROM product_categories WHERE name='Footwear';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-067','Custom Kicks No. 03',id,'Hand-painted custom footwear, one of one','https://asset-huggers.lovable.app/__l5e/assets-v1/bad5b690-9608-438c-85c5-35954133051a/foot-03.webp','Custom Kicks No. 03' FROM product_categories WHERE name='Footwear';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-068','Custom Kicks No. 04',id,'Hand-painted custom footwear, one of one','https://asset-huggers.lovable.app/__l5e/assets-v1/5b685229-83bc-4073-b39a-7e036c21d56b/foot-04.webp','Custom Kicks No. 04' FROM product_categories WHERE name='Footwear';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-069','Custom Kicks No. 05',id,'Hand-painted custom footwear, one of one','https://asset-huggers.lovable.app/__l5e/assets-v1/3f93f521-8967-41d4-9037-a13b15e5d715/foot-05.webp','Custom Kicks No. 05' FROM product_categories WHERE name='Footwear';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-070','Custom Kicks No. 06',id,'Hand-painted custom footwear, one of one','https://asset-huggers.lovable.app/__l5e/assets-v1/4f63a6a0-33a0-4194-aba7-513e45c1910f/foot-06.webp','Custom Kicks No. 06' FROM product_categories WHERE name='Footwear';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-071','Custom Kicks No. 07',id,'Hand-painted custom footwear, one of one','https://asset-huggers.lovable.app/__l5e/assets-v1/dd2c26f5-fec4-445f-b9e3-74aaf6f6b49c/foot-07.webp','Custom Kicks No. 07' FROM product_categories WHERE name='Footwear';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-072','Custom Kicks No. 08',id,'Hand-painted custom footwear, one of one','https://asset-huggers.lovable.app/__l5e/assets-v1/e6b1a96c-5cc9-4936-8576-04c45e9db4c0/foot-08.webp','Custom Kicks No. 08' FROM product_categories WHERE name='Footwear';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-073','Custom Kicks No. 09',id,'Hand-painted custom footwear, one of one','https://asset-huggers.lovable.app/__l5e/assets-v1/11a97cd4-00b3-4b85-a5d8-d71118d872c5/foot-09.webp','Custom Kicks No. 09' FROM product_categories WHERE name='Footwear';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-074','Custom Kicks No. 10',id,'Hand-painted custom footwear, one of one','https://asset-huggers.lovable.app/__l5e/assets-v1/f23937c5-2ded-4982-a540-07d35a361c2f/foot-10.webp','Custom Kicks No. 10' FROM product_categories WHERE name='Footwear';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-075','Custom Kicks No. 11',id,'Hand-painted custom footwear, one of one','https://asset-huggers.lovable.app/__l5e/assets-v1/85ab77eb-c186-46ba-82f8-8c2beade6258/foot-11.webp','Custom Kicks No. 11' FROM product_categories WHERE name='Footwear';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-076','Custom Kicks No. 12',id,'Hand-painted custom footwear, one of one','https://asset-huggers.lovable.app/__l5e/assets-v1/f01c1314-6ab8-4fb9-9040-37eef1b66a5d/foot-12.webp','Custom Kicks No. 12' FROM product_categories WHERE name='Footwear';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-077','Custom Kicks No. 13',id,'Hand-painted custom footwear, one of one','https://asset-huggers.lovable.app/__l5e/assets-v1/0c34134c-4572-4df5-a1fe-fb002ed40ce4/foot-13.webp','Custom Kicks No. 13' FROM product_categories WHERE name='Footwear';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-078','Painted Carry No. 01',id,'Hand-painted bag or luggage, one of one','https://asset-huggers.lovable.app/__l5e/assets-v1/8855464a-8d95-4581-b31e-716dbe6d0731/bag-01.webp','Painted Carry No. 01' FROM product_categories WHERE name='Bags';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-079','Painted Carry No. 02',id,'Hand-painted bag or luggage, one of one','https://asset-huggers.lovable.app/__l5e/assets-v1/4c650176-5651-457a-af2f-a40225b3a6a9/bag-02.webp','Painted Carry No. 02' FROM product_categories WHERE name='Bags';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-080','Painted Carry No. 03',id,'Hand-painted bag or luggage, one of one','https://asset-huggers.lovable.app/__l5e/assets-v1/0100a7b8-f9a5-4792-98a8-58d1314bc9f8/bag-03.webp','Painted Carry No. 03' FROM product_categories WHERE name='Bags';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-081','Painted Carry No. 04',id,'Hand-painted bag or luggage, one of one','https://asset-huggers.lovable.app/__l5e/assets-v1/c490fb33-c4ff-41c8-9c98-3709a7f2d987/bag-04.webp','Painted Carry No. 04' FROM product_categories WHERE name='Bags';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-082','Painted Carry No. 05',id,'Hand-painted bag or luggage, one of one','https://asset-huggers.lovable.app/__l5e/assets-v1/13a5510a-676f-4e21-8e29-a5f9947dbc52/bag-05.webp','Painted Carry No. 05' FROM product_categories WHERE name='Bags';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-083','Painted Carry No. 06',id,'Hand-painted bag or luggage, one of one','https://asset-huggers.lovable.app/__l5e/assets-v1/a8b32f11-7373-466d-b518-aeb50719caeb/bag-06.webp','Painted Carry No. 06' FROM product_categories WHERE name='Bags';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-084','Painted Carry No. 07',id,'Hand-painted bag or luggage, one of one','https://asset-huggers.lovable.app/__l5e/assets-v1/d023a726-13db-4803-89a2-da966049731b/bag-07.webp','Painted Carry No. 07' FROM product_categories WHERE name='Bags';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-085','Painted Carry No. 08',id,'Hand-painted bag or luggage, one of one','https://asset-huggers.lovable.app/__l5e/assets-v1/1f26a3ee-bb53-4f29-83ec-11ff82f087e9/bag-08.webp','Painted Carry No. 08' FROM product_categories WHERE name='Bags';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-086','Painted Carry No. 09',id,'Hand-painted bag or luggage, one of one','https://asset-huggers.lovable.app/__l5e/assets-v1/2f03a04d-9f25-4697-9182-d4637f308b4f/bag-09.webp','Painted Carry No. 09' FROM product_categories WHERE name='Bags';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-087','Painted Carry No. 10',id,'Hand-painted bag or luggage, one of one','https://asset-huggers.lovable.app/__l5e/assets-v1/8c5b807d-52da-48f0-89d5-ceb08a8c9d18/bag-10.webp','Painted Carry No. 10' FROM product_categories WHERE name='Bags';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-088','Painted Carry No. 11',id,'Hand-painted bag or luggage, one of one','https://asset-huggers.lovable.app/__l5e/assets-v1/0458b4d9-943c-4442-b3cc-637a8f12d97e/bag-11.webp','Painted Carry No. 11' FROM product_categories WHERE name='Bags';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-089','Painted Carry No. 12',id,'Hand-painted bag or luggage, one of one','https://asset-huggers.lovable.app/__l5e/assets-v1/085fc730-2171-4b7b-9da1-eb0b99d615fa/bag-12.webp','Painted Carry No. 12' FROM product_categories WHERE name='Bags';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-090','Painted Carry No. 13',id,'Hand-painted bag or luggage, one of one','https://asset-huggers.lovable.app/__l5e/assets-v1/ccde042b-cc7b-41ec-baf5-bd272c5c9e4a/bag-13.webp','Painted Carry No. 13' FROM product_categories WHERE name='Bags';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-091','Painted Carry No. 14',id,'Hand-painted bag or luggage, one of one','https://asset-huggers.lovable.app/__l5e/assets-v1/cb21dc80-d509-47e1-bfe4-2cb22f5d9967/bag-14.webp','Painted Carry No. 14' FROM product_categories WHERE name='Bags';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-092','Painted Carry No. 15',id,'Hand-painted bag or luggage, one of one','https://asset-huggers.lovable.app/__l5e/assets-v1/92e3acbb-213f-4e21-ad6c-b9575744ca46/bag-15.webp','Painted Carry No. 15' FROM product_categories WHERE name='Bags';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-093','Painted Carry No. 16',id,'Hand-painted bag or luggage, one of one','https://asset-huggers.lovable.app/__l5e/assets-v1/d27f9773-abf9-47a1-89f3-2d0638a3ad28/bag-16.webp','Painted Carry No. 16' FROM product_categories WHERE name='Bags';

INSERT INTO products (product_ref,name,category_id,description,main_image_url,image_alt) SELECT 'ECI-094','Painted Carry No. 17',id,'Hand-painted bag or luggage, one of one','https://asset-huggers.lovable.app/__l5e/assets-v1/e71cd0c6-0d0c-4afc-a69d-a9e9a99aad01/bag-17.webp','Painted Carry No. 17' FROM product_categories WHERE name='Bags';

INSERT INTO artworks (artwork_ref,name,image_url,image_alt) VALUES ('C-01','Just Being You','https://asset-huggers.lovable.app/__l5e/assets-v1/acd1f1c8-7b7a-4c50-ac57-6163c8c1b9b3/art-01.webp','Just Being You — original painting by Edmond Clinton');

INSERT INTO artworks (artwork_ref,name,image_url,image_alt) VALUES ('C-02','Gateway Notes','https://asset-huggers.lovable.app/__l5e/assets-v1/f414a251-fd80-4436-8ffb-8e0bff998b82/art-02.webp','Gateway Notes — original painting by Edmond Clinton');

INSERT INTO artworks (artwork_ref,name,image_url,image_alt) VALUES ('C-03','The Grin','https://asset-huggers.lovable.app/__l5e/assets-v1/1b3fb0d3-dfb3-47d9-8ec4-186be61ca627/art-03.webp','The Grin — original painting by Edmond Clinton');

INSERT INTO artworks (artwork_ref,name,image_url,image_alt) VALUES ('C-04','Dream Big Dreams','https://asset-huggers.lovable.app/__l5e/assets-v1/86549512-7404-41cd-a167-cc9adfe220ee/art-04.webp','Dream Big Dreams — original painting by Edmond Clinton');

INSERT INTO artworks (artwork_ref,name,image_url,image_alt) VALUES ('C-05','Tiger Garden','https://asset-huggers.lovable.app/__l5e/assets-v1/0760b1ba-613e-45cd-bdb8-3815fb79e41c/art-05.webp','Tiger Garden — original painting by Edmond Clinton');

INSERT INTO artworks (artwork_ref,name,image_url,image_alt) VALUES ('C-06','Love Pop Diptych','https://asset-huggers.lovable.app/__l5e/assets-v1/92d0b998-3e01-4e5c-b472-57b726ac582c/art-06.webp','Love Pop Diptych — original painting by Edmond Clinton');

INSERT INTO artworks (artwork_ref,name,image_url,image_alt) VALUES ('C-07','Red Fever','https://asset-huggers.lovable.app/__l5e/assets-v1/66545f92-f059-4d65-9fd9-86b57e6480d9/art-07.webp','Red Fever — original painting by Edmond Clinton');

INSERT INTO artworks (artwork_ref,name,image_url,image_alt) VALUES ('C-08','The Studio Floor','https://asset-huggers.lovable.app/__l5e/assets-v1/d54b75dd-082a-400d-92d2-e6ea70b49ad9/art-08.webp','The Studio Floor — original painting by Edmond Clinton');