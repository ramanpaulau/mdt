package com.example.mdtapi.rest;

import com.example.mdtapi.utils.Chapter;
import com.example.mdtapi.utils.Law;
import com.example.mdtapi.utils.ResponseMessage;
import com.example.mdtapi.utils.Subchapter;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.*;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.xml.XMLConstants;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.*;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
public class PenalCodeRest {

    private static final String FILENAME = System.getProperty("user.dir") + "/penal-code.xml";

    @GetMapping("/penal-code")
    public List<Chapter> all() {
        DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
        List<Chapter> result = new ArrayList<Chapter>();

        try {
            dbf.setFeature(XMLConstants.FEATURE_SECURE_PROCESSING, true);
            DocumentBuilder db = dbf.newDocumentBuilder();
            Document doc = db.parse(new File(FILENAME));

            NodeList list = doc.getElementsByTagName("chapter");

            for (int temp = 0; temp < list.getLength(); temp++) {
                Node node = list.item(temp);

                if (node.getNodeType() == Node.ELEMENT_NODE) {
                    Element element = (Element) node;
                    String title = element.getAttribute("title");
                    List<Subchapter> subchapters = this.getSubchapters(element);
                    Chapter chapter = new Chapter(temp + 1, title, subchapters);
                    result.add(chapter);
                }
            }
        } catch (ParserConfigurationException | SAXException | IOException e) {
            e.printStackTrace();
        }

        return result;
    }

    private List<Subchapter> getSubchapters(Element chapter) {
        List<Subchapter> result = new ArrayList<Subchapter>();
        NodeList list = chapter.getElementsByTagName("subchapter");

        for (int temp = 0; temp < list.getLength(); temp++) {
            Node node = list.item(temp);

            if (node.getNodeType() == Node.ELEMENT_NODE) {
                Element element = (Element) node;
                String title = element.getAttribute("title");
                List<Law> laws = this.getLaws(element);
                Subchapter subchapter = new Subchapter(temp + 1, title, laws);
                result.add(subchapter);
            }
        }
        return result;
    }

    private List<Law> getLaws(Element subchapter) {
        List<Law> result = new ArrayList<Law>();
        NodeList list = subchapter.getElementsByTagName("law");

        for (int temp = 0; temp < list.getLength(); temp++) {
            Node node = list.item(temp);

            if (node.getNodeType() == Node.ELEMENT_NODE) {
                Element element = (Element) node;
                String text = element.getAttribute("text");
                int fine = 0;
                int detention = 0;
                try {
                    fine = Integer.parseInt(element.getAttribute("fine"));
                    detention = Integer.parseInt(element.getAttribute("detention"));
                } catch (NumberFormatException ignored) { }
                Law law = new Law(temp + 1, text, fine, detention);
                result.add(law);
            }
        }
        return result;
    }

    @PostMapping("/penal-code/chapter")
    public ResponseMessage insertChapter(@RequestBody String title) {
        ResponseMessage res = new ResponseMessage();
        DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();

        try {
            dbf.setFeature(XMLConstants.FEATURE_SECURE_PROCESSING, true);
            DocumentBuilder db = dbf.newDocumentBuilder();
            Document doc = db.parse(new File(FILENAME));
            Element root = doc.getDocumentElement();
            Element chapter = doc.createElement("chapter");
            chapter.setAttribute("title", title);
            root.appendChild(chapter);

            Transformer transformer = TransformerFactory.newInstance().newTransformer();
            Result output = new StreamResult(new File(FILENAME));
            Source input = new DOMSource(doc);
            transformer.transform(input, output);
        } catch (ParserConfigurationException | SAXException | IOException | TransformerException e) {
            e.printStackTrace();
            res.setSuccess(false);
            res.setMessage("Error while working with XML");
            return res;
        }
        return res;
    }

    @PostMapping("/penal-code/subchapter")
    public ResponseMessage insertSubchapter(@RequestBody String request) {
        ResponseMessage res = new ResponseMessage();

        int chapter;
        String title;
        JSONObject subchapter = new JSONObject(request);
        try {
            chapter = subchapter.getInt("chapter") - 1;
            if (chapter < 0)
                throw new JSONException("Negative value");
            title = subchapter.getString("title");
        } catch (JSONException ignored) {
            res.setSuccess(false);
            res.setMessage("Wrong json format");
            return res;
        }

        DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();

        try {
            dbf.setFeature(XMLConstants.FEATURE_SECURE_PROCESSING, true);
            DocumentBuilder db = dbf.newDocumentBuilder();
            Document doc = db.parse(new File(FILENAME));

            NodeList list = doc.getElementsByTagName("chapter");

            Element subchapterElem = doc.createElement("subchapter");
            subchapterElem.setAttribute("title", title);

            list.item(chapter).appendChild(subchapterElem);

            Transformer transformer = TransformerFactory.newInstance().newTransformer();
            Result output = new StreamResult(new File(FILENAME));
            Source input = new DOMSource(doc);
            transformer.transform(input, output);
        } catch (ParserConfigurationException | SAXException | IOException | TransformerException e) {
            e.printStackTrace();
            res.setSuccess(false);
            res.setMessage("Error while working with XML");
            return res;
        }
        return res;
    }

    @PostMapping("/penal-code/law")
    public ResponseMessage insertLaw(@RequestBody String request) {
        ResponseMessage res = new ResponseMessage();

        int chapter, subchapter, fine, detention;
        String text;
        JSONObject law = new JSONObject(request);
        try {
            chapter = law.getInt("chapter") - 1;
            subchapter = law.getInt("subchapter") - 1;
            fine = law.getInt("fine");
            detention = law.getInt("detention");
            if (chapter < 0 || subchapter < 0 || fine < 0 || detention < 0)
                throw new JSONException("Negative value");
            text = law.getString("text");
        } catch (JSONException ignored) {
            res.setSuccess(false);
            res.setMessage("Wrong json format");
            return res;
        }

        DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();

        try {
            dbf.setFeature(XMLConstants.FEATURE_SECURE_PROCESSING, true);
            DocumentBuilder db = dbf.newDocumentBuilder();
            Document doc = db.parse(new File(FILENAME));

            Element chapterNode = (Element) doc.getElementsByTagName("chapter").item(chapter);
            NodeList subChapterList = chapterNode.getElementsByTagName("subchapter");

            Element lawElem = doc.createElement("law");
            lawElem.setAttribute("text", text);
            lawElem.setAttribute("fine", String.valueOf(fine));
            lawElem.setAttribute("detention", String.valueOf(detention));

            subChapterList.item(subchapter).appendChild(lawElem);

            Transformer transformer = TransformerFactory.newInstance().newTransformer();
            Result output = new StreamResult(new File(FILENAME));
            Source input = new DOMSource(doc);
            transformer.transform(input, output);
        } catch (ParserConfigurationException | SAXException | IOException | TransformerException e) {
            e.printStackTrace();
            res.setSuccess(false);
            res.setMessage("Error while working with XML");
            return res;
        }
        return res;
    }

    @DeleteMapping("/penal-code/chapter/{chapter}")
    private ResponseMessage deleteChapter(@PathVariable Integer chapter) {
        ResponseMessage res = new ResponseMessage();

        if (chapter < 1) {
            res.setSuccess(false);
            res.setMessage("Negative value");
            return res;
        }

        DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();

        try {
            dbf.setFeature(XMLConstants.FEATURE_SECURE_PROCESSING, true);
            DocumentBuilder db = dbf.newDocumentBuilder();
            Document doc = db.parse(new File(FILENAME));

            Element root = doc.getDocumentElement();
            NodeList list = doc.getElementsByTagName("chapter");
            root.removeChild(list.item(chapter - 1));

            Transformer transformer = TransformerFactory.newInstance().newTransformer();
            Result output = new StreamResult(new File(FILENAME));
            Source input = new DOMSource(doc);
            transformer.transform(input, output);
        } catch (ParserConfigurationException | SAXException | IOException | TransformerException e) {
            e.printStackTrace();
            res.setSuccess(false);
            res.setMessage("Error while working with XML");
            return res;
        }
        return res;
    }

    @DeleteMapping("/penal-code/subchapter/{chapter}/{subchapter}")
    private ResponseMessage deleteSubchapter(@PathVariable Integer chapter, @PathVariable Integer subchapter) {
        ResponseMessage res = new ResponseMessage();

        if (chapter < 1 || subchapter < 1) {
            res.setSuccess(false);
            res.setMessage("Negative value");
            return res;
        }

        DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();

        try {
            dbf.setFeature(XMLConstants.FEATURE_SECURE_PROCESSING, true);
            DocumentBuilder db = dbf.newDocumentBuilder();
            Document doc = db.parse(new File(FILENAME));

            Element chapterElem = (Element) doc.getElementsByTagName("chapter").item(chapter - 1);
            Element subchapterElem = (Element) chapterElem.getElementsByTagName("subchapter").item(subchapter - 1);
            chapterElem.removeChild(subchapterElem);

            Transformer transformer = TransformerFactory.newInstance().newTransformer();
            Result output = new StreamResult(new File(FILENAME));
            Source input = new DOMSource(doc);
            transformer.transform(input, output);
        } catch (ParserConfigurationException | SAXException | IOException | TransformerException e) {
            e.printStackTrace();
            res.setSuccess(false);
            res.setMessage("Error while working with XML");
            return res;
        }
        return res;
    }

    @DeleteMapping("/penal-code/law/{chapter}/{subchapter}/{law}")
    private ResponseMessage deleteLaw(@PathVariable Integer chapter, @PathVariable Integer subchapter, @PathVariable Integer law) {
        ResponseMessage res = new ResponseMessage();

        if (chapter < 1 || subchapter < 1 || law < 1) {
            res.setSuccess(false);
            res.setMessage("Negative value");
            return res;
        }

        DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();

        try {
            dbf.setFeature(XMLConstants.FEATURE_SECURE_PROCESSING, true);
            DocumentBuilder db = dbf.newDocumentBuilder();
            Document doc = db.parse(new File(FILENAME));

            Element chapterElem = (Element) doc.getElementsByTagName("chapter").item(chapter - 1);
            Element subchapterElem = (Element) chapterElem.getElementsByTagName("subchapter").item(subchapter - 1);
            Element lawElem = (Element) subchapterElem.getElementsByTagName("law").item(law - 1);
            subchapterElem.removeChild(lawElem);

            Transformer transformer = TransformerFactory.newInstance().newTransformer();
            Result output = new StreamResult(new File(FILENAME));
            Source input = new DOMSource(doc);
            transformer.transform(input, output);
        } catch (ParserConfigurationException | SAXException | IOException | TransformerException e) {
            e.printStackTrace();
            res.setSuccess(false);
            res.setMessage("Error while working with XML");
            return res;
        }
        return res;
    }
}
