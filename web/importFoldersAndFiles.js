import fs from "fs";
import path from "path";
import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  user: "dbuser",
  password: "secret",
  host: "192.168.1.11",
  port: 5432,
  database: "postgres",
});

const basePath = "D:\\Project_xl_sheets\\hlic\\Variable_Endorsements_details";

async function importFoldersAndFiles() {
  try {
    await pool.query("SET search_path TO dms");
    const items = fs.readdirSync(basePath, { withFileTypes: true });

    const folders = items.filter((item) => item.isDirectory()).map((folder) => folder.name);

    const { rows: folderRows } = await pool.query("SELECT MAX(id) as max_id FROM dms.mst_endorsement_type");
    let currentFolderId = folderRows[0].max_id ? folderRows[0].max_id + 1 : 1;

    const { rows: subTypeRows } = await pool.query("SELECT MAX(id) as max_id FROM dms.mst_endorsement_sub_type");
    let currentSubTypeId = subTypeRows[0].max_id ? subTypeRows[0].max_id + 1 : 1;

    for (const folder of folders) {
      await pool.query(
        "INSERT INTO dms.mst_endorsement_type (id, name, code, created_by) VALUES ($1, $2, $3, $4)",
        [currentFolderId, folder, folder, 'admin']
      );

      const folderPath = path.join(basePath, folder);
      const files = fs.readdirSync(folderPath, { withFileTypes: true })
        .filter((f) => f.isFile())
        .map((f) => f.name);

      for (const file of files) {
        const cleanName = file.replace(/\.[^/.]+$/, "");
        const existingFile = await pool.query(
          "SELECT id FROM dms.mst_endorsement_sub_type WHERE name = $1 AND endorsement_type = $2",
          [cleanName, currentFolderId]
        );
        if (existingFile.rows.length === 0) {
          await pool.query(
            "INSERT INTO dms.mst_endorsement_sub_type (id, name,code, endorsement_type, created_by) VALUES ($1, $2, $3, $4,$5)",
            [currentSubTypeId, cleanName, cleanName, currentFolderId, 'admin']
          );
          currentSubTypeId++;
        } 
      }

        currentFolderId++;
      }

      console.log("All folders and their files inserted successfully!");
    } catch (err) {
      console.error("Error:", err);
    } finally {
      await pool.end();
    }
  }

importFoldersAndFiles();
